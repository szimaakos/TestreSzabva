using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestreSzabva.Data;
using TestreSzabva.Models;

namespace TestreSzabva.Controllers
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

        [HttpGet]
        public async Task<IActionResult> GetAllEtelek()
        {
            var etelek = await _context.Etelek.ToListAsync();
            return Ok(etelek);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEtel(int id)
        {
            var etel = await _context.Etelek.FindAsync(id);
            if (etel == null)
            {
                return NotFound();
            }
            return Ok(etel);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEtel([FromBody] Etel etel)
        {
            _context.Etelek.Add(etel);
            await _context.SaveChangesAsync();

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
