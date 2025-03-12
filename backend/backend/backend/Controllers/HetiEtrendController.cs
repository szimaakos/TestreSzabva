using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HetiEtrendController : ControllerBase
    {
        private readonly TestreSzabvaContext _context;

        public HetiEtrendController(TestreSzabvaContext context)
        {
            _context = context;
        }

        // GET: api/HetiEtrend/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMealSlot(int id)
        {
            var mealSlot = await _context.HetiEtrendek
                .Include(m => m.MealFoods)
                    .ThenInclude(mf => mf.Etel)
                .FirstOrDefaultAsync(m => m.PlanId == id);

            if (mealSlot == null)
            {
                return NotFound();
            }

            return Ok(mealSlot);
        }

        // GET: api/HetiEtrend/Felhasznalo/{userId}
        [HttpGet("Felhasznalo/{userId}")]
        public async Task<IActionResult> GetMealSlotsByUser(string userId)
        {
            var mealSlots = await _context.HetiEtrendek
                .Where(m => m.UserId == userId)
                .Include(m => m.MealFoods)
                    .ThenInclude(mf => mf.Etel)
                .Select(m => new {
                    m.PlanId,
                    m.UserId,
                    m.DayOfWeek,
                    m.MealTime,
                    MealFoods = m.MealFoods.Select(mf => new {
                        mf.Id,
                        mf.FoodId,
                        mf.Quantity,
                        mf.TotalCalories,
                        Etel = new
                        {
                            mf.Etel.FoodId,
                            mf.Etel.Name,
                            mf.Etel.Calories,
                            mf.Etel.Protein,
                            mf.Etel.Carbs,
                            mf.Etel.Fats
                        }
                    }).ToList()
                })
                .ToListAsync();

            return Ok(mealSlots);

        }


        // POST: api/HetiEtrend/mealSlot
        [HttpPost("mealSlot")]
        public async Task<IActionResult> CreateMealSlot([FromBody] CreateMealSlotDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Először hozzuk létre a szülő entitást
            var mealSlot = new HetiEtrend
            {
                UserId = dto.UserId,
                DayOfWeek = dto.DayOfWeek,
                MealTime = dto.MealTime
            };

            // Ezután hozzuk létre a gyermek entitásokat úgy, hogy a szülőre is hivatkoznak
            mealSlot.MealFoods = dto.MealFoods.Select(mf => new MealFood
            {
                FoodId = mf.FoodId,
                Quantity = mf.Quantity,
                TotalCalories = mf.TotalCalories,
                MealSlot = mealSlot  // Itt adod meg a kapcsolatot!
            }).ToList();

            _context.HetiEtrendek.Add(mealSlot);
            await _context.SaveChangesAsync();

            // Betöltjük a navigációs tulajdonságot (opcionális, ha szükséges a visszaküldéshez)
            await _context.Entry(mealSlot)
                          .Collection(m => m.MealFoods)
                          .Query()
                          .Include(mf => mf.Etel)
                          .LoadAsync();

            return CreatedAtAction(nameof(GetMealSlot), new { id = mealSlot.PlanId }, mealSlot);
        }



        // PUT: api/HetiEtrend/mealSlot/{id}
        [HttpPut("mealSlot/{id}")]
        public async Task<IActionResult> UpdateMealSlot(int id, [FromBody] UpdateMealSlotDto dto)
        {
            if (id != dto.PlanId)
            {
                return BadRequest("Az ID nem egyezik.");
            }

            var mealSlot = await _context.HetiEtrendek
                .Include(m => m.MealFoods)
                .FirstOrDefaultAsync(m => m.PlanId == id);

            if (mealSlot == null)
            {
                return NotFound();
            }

            mealSlot.UserId = dto.UserId;
            mealSlot.DayOfWeek = dto.DayOfWeek;
            mealSlot.MealTime = dto.MealTime;

            // Töröljük a korábbi MealFoods rekordokat
            _context.MealFoods.RemoveRange(mealSlot.MealFoods);

            // Új MealFoods létrehozása a szülő kapcsolattal
            mealSlot.MealFoods = dto.MealFoods.Select(mf => new MealFood
            {
                FoodId = mf.FoodId,
                Quantity = mf.Quantity,
                TotalCalories = mf.TotalCalories,
                MealSlot = mealSlot  // Itt is beállítjuk a kapcsolatot
            }).ToList();

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // DELETE: api/HetiEtrend/mealSlot/{id}
        [HttpDelete("mealSlot/{id}")]
        public async Task<IActionResult> DeleteMealSlot(int id)
        {
            var mealSlot = await _context.HetiEtrendek
                .Include(m => m.MealFoods)
                .FirstOrDefaultAsync(m => m.PlanId == id);
            if (mealSlot == null)
            {
                return NotFound();
            }

            _context.MealFoods.RemoveRange(mealSlot.MealFoods);
            _context.HetiEtrendek.Remove(mealSlot);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}