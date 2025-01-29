using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestreSzabva.Data;
using TestreSzabva.Models;

namespace TestreSzabva.Controllers
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEtrend(int id)
        {
            var etrend = await _context.HetiEtrendek
                .Include(e => e.Etel)
                .Include(e => e.Felhasznalo)
                .FirstOrDefaultAsync(e => e.PlanId == id);

            if (etrend == null)
            {
                return NotFound();
            }

            return Ok(etrend);
        }

        [HttpGet("Felhasznalo/{userId}")]
        public async Task<IActionResult> GetEtrendByUser(string userId)
        {
            var etrendek = await _context.HetiEtrendek
                .Where(e => e.UserId == userId)
                .Include(e => e.Etel)
                .ToListAsync();

            return Ok(etrendek);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEtrend([FromBody] HetiEtrend etrend)
        {
            _context.HetiEtrendek.Add(etrend);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEtrend), new { id = etrend.PlanId }, etrend);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEtrend(int id, [FromBody] HetiEtrend updatedEtrend)
        {
            if (id != updatedEtrend.PlanId)
            {
                return BadRequest("Az ID nem egyezik.");
            }

            var etrend = await _context.HetiEtrendek.FindAsync(id);
            if (etrend == null)
            {
                return NotFound();
            }

            etrend.DayOfWeek = updatedEtrend.DayOfWeek;
            etrend.MealTime = updatedEtrend.MealTime;
            etrend.Quantity = updatedEtrend.Quantity;
            etrend.TotalCalories = updatedEtrend.TotalCalories;
            etrend.FoodId = updatedEtrend.FoodId; // Ha ezt is szeretnéd frissíteni

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtrend(int id)
        {
            var etrend = await _context.HetiEtrendek.FindAsync(id);
            if (etrend == null)
            {
                return NotFound();
            }

            _context.HetiEtrendek.Remove(etrend);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
