using System.Linq;
using backend.Models;

namespace backend.Data
{
    public static class SeedData
    {
        public static void Initialize(TestreSzabvaContext context)
        {
            // Ellenőrizzük, hogy a Kategoriak tábla üres-e
            if (!context.Kategoriak.Any())
            {
                var kategoriak = new[]
                {
                    new Kategoria { Name = "Reggeli" },
                    new Kategoria { Name = "Ebéd" },
                    new Kategoria { Name = "Snack" },
                    new Kategoria { Name = "Vacsora" }
                };

                context.Kategoriak.AddRange(kategoriak);
                context.SaveChanges();
            }

            // Nem seedelünk előre ételeket, így az Etelek tábla üres marad.
        }
    }
}