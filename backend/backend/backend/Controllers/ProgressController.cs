using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProgressController : ControllerBase
    {
        private readonly TestreSzabvaContext _context;

        public ProgressController(TestreSzabvaContext context)
        {
            _context = context;
        }

        // GET: api/Progress/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<ProgressRecord>>> GetProgressForUser(string userId)
        {
            var records = await _context.ProgressRecords
                .Where(pr => pr.UserId == userId)
                .OrderBy(pr => pr.Date)
                .ToListAsync();

            return records;
        }

        // POST: api/Progress
        [HttpPost]
        [HttpPost]
        public async Task<ActionResult<ProgressRecord>> CreateProgressRecord([FromBody] ProgressRecord record)
        {
            Console.WriteLine($"Beérkezett adatok: UserId={record.UserId}, Date={record.Date}, Weight={record.Weight}");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ellenőrizzük, hogy létezik-e már naplózás ugyanarra a napra
            var existingRecord = await _context.ProgressRecords
                .FirstOrDefaultAsync(pr => pr.UserId == record.UserId && pr.Date.Date == record.Date.Date);

            if (existingRecord != null)
            {
                // Ha van már ilyen dátumú rekord, frissítjük azt
                existingRecord.Weight = record.Weight;
                existingRecord.Calories = record.Calories;

                _context.ProgressRecords.Update(existingRecord);
                await _context.SaveChangesAsync();

                return Ok(existingRecord);
            }

            // Ha nincs még ilyen dátumú rekord, újat hozunk létre
            _context.ProgressRecords.Add(record);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProgressForUser), new { userId = record.UserId }, record);
        }

        // PUT: api/Progress/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProgressRecord(int id, [FromBody] ProgressRecord record)
        {
            if (id != record.Id)
            {
                return BadRequest("A megadott ID nem egyezik a rekord ID-jával.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(record).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProgressRecordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Progress/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgressRecord(int id)
        {
            var record = await _context.ProgressRecords.FindAsync(id);
            if (record == null)
            {
                return NotFound();
            }

            _context.ProgressRecords.Remove(record);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProgressRecordExists(int id)
        {
            return _context.ProgressRecords.Any(e => e.Id == id);
        }
    }
}