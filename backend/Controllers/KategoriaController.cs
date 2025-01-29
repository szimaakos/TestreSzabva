using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestreSzabva.Data;
using TestreSzabva.Models;

namespace TestreSzabva.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KategoriaController : ControllerBase
    {
        private readonly TestreSzabvaContext _context;

        public KategoriaController(TestreSzabvaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllKategoriak()
        {
            var kategoriak = await _context.Kategoriak.ToListAsync();
            return Ok(kategoriak);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetKategoria(int id)
        {
            var kategoria = await _context.Kategoriak.FindAsync(id);
            if (kategoria == null)
            {
                return NotFound();
            }
            return Ok(kategoria);
        }

        [HttpPost]
        public async Task<IActionResult> CreateKategoria([FromBody] Kategoria kategoria)
        {
            _context.Kategoriak.Add(kategoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetKategoria), new { id = kategoria.CategoryId }, kategoria);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKategoria(int id, [FromBody] Kategoria updatedKategoria)
        {
            if (id != updatedKategoria.CategoryId)
            {
                return BadRequest("Az ID nem egyezik.");
            }

            var kategoria = await _context.Kategoriak.FindAsync(id);
            if (kategoria == null)
            {
                return NotFound();
            }

            kategoria.Name = updatedKategoria.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKategoria(int id)
        {
            var kategoria = await _context.Kategoriak.FindAsync(id);
            if (kategoria == null)
            {
                return NotFound();
            }

            _context.Kategoriak.Remove(kategoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
