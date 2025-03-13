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
        public async Task<IActionResult> UpdateEtel(int id, [FromBody] CreateFoodDto dto)
        {
            // 1) Modellellenőrzés
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 2) Lekérjük az ételt és a hozzá tartozó kategória-kapcsolatokat
            var etel = await _context.Etelek
                .Include(e => e.EtelKategoriak)
                .FirstOrDefaultAsync(e => e.FoodId == id);

            if (etel == null)
            {
                return NotFound();
            }

            // 3) Alapadatok frissítése
            etel.Name = dto.Name;
            etel.Calories = dto.Calories;
            etel.Protein = dto.Protein;
            etel.Carbs = dto.Carbs;
            etel.Fats = dto.Fats;

            // 4) Kategóriák frissítése
            // Megnézzük, mik voltak korábban, és miket kér az új dto
            var existingCatIds = etel.EtelKategoriak.Select(ek => ek.CategoryId).ToList();
            var catIdsToRemove = existingCatIds.Except(dto.CategoryIds).ToList();
            var catIdsToAdd = dto.CategoryIds.Except(existingCatIds).ToList();

            // 4/a) Töröljük a régi, már nem kellő kategóriákat
            foreach (var catId in catIdsToRemove)
            {
                var toRemove = etel.EtelKategoriak.FirstOrDefault(ek => ek.CategoryId == catId);
                if (toRemove != null)
                {
                    _context.EtelKategoriak.Remove(toRemove);
                }
            }

            // 4/b) Hozzáadjuk az újakat
            foreach (var catId in catIdsToAdd)
            {
                etel.EtelKategoriak.Add(new EtelKategoria { FoodId = etel.FoodId, CategoryId = catId });
            }

            // 5) Mentés
            await _context.SaveChangesAsync();

            // Visszaadhatsz 204 NoContent-et vagy az új modellt is
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