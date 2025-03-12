using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EtelController : ControllerBase
    {
        private readonly TestreSzabvaContext _context;

        public EtelController(TestreSzabvaContext context)
        {
            _context = context;
        }

        // GET: api/Etel – eager loading a kategóriákhoz
        [HttpGet]
        public async Task<IActionResult> GetAllEtelek()
        {
            var etelek = await _context.Etelek
                .Include(e => e.EtelKategoriak)
                .ThenInclude(ek => ek.Kategoria)
                .ToListAsync();
            return Ok(etelek);
        }

        // GET: api/Etel/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEtel(int id)
        {
            var etel = await _context.Etelek
                .Include(e => e.EtelKategoriak)
                .ThenInclude(ek => ek.Kategoria)
                .FirstOrDefaultAsync(e => e.FoodId == id);

            if (etel == null)
            {
                return NotFound();
            }
            return Ok(etel);
        }

        // POST: api/Etel – itt fogadjuk a CreateFoodDto-t a WPF‑ből
        [HttpPost]
        public async Task<IActionResult> CreateEtel([FromBody] CreateFoodDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Map a DTO-t az Etel entitásra
            var etel = new Etel
            {
                Name = dto.Name,
                Calories = dto.Calories,
                Protein = dto.Protein,
                Carbs = dto.Carbs,
                Fats = dto.Fats
            };

            // Ha van kategória azonosító, adjuk hozzá a kapcsolati rekordokat
            if (dto.CategoryIds != null && dto.CategoryIds.Count > 0)
            {
                foreach (var catId in dto.CategoryIds)
                {
                    etel.EtelKategoriak.Add(new EtelKategoria { CategoryId = catId });
                }
            }

            _context.Etelek.Add(etel);
            await _context.SaveChangesAsync();

            // Töltsük be a kapcsolódó kategória adatokat (eager loading)
            await _context.Entry(etel)
                .Collection(e => e.EtelKategoriak)
                .Query()
                .Include(ek => ek.Kategoria)
                .LoadAsync();

            return CreatedAtAction(nameof(GetEtel), new { id = etel.FoodId }, etel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEtel(int id, [FromBody] Etel updatedEtel)
        {
            if (id != updatedEtel.FoodId)
            {
                return BadRequest("Az ID nem egyezik.");
            }

            var etel = await _context.Etelek.FindAsync(id);
            if (etel == null)
            {
                return NotFound();
            }

            etel.Name = updatedEtel.Name;
            etel.Calories = updatedEtel.Calories;
            etel.Protein = updatedEtel.Protein;
            etel.Carbs = updatedEtel.Carbs;
            etel.Fats = updatedEtel.Fats;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtel(int id)
        {
            var etel = await _context.Etelek.FindAsync(id);
            if (etel == null)
            {
                return NotFound();
            }

            _context.Etelek.Remove(etel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}