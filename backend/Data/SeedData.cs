using Microsoft.EntityFrameworkCore;
using TestreSzabva.Models;

namespace TestreSzabva.Data
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
                    new Kategoria { Name = "Levesek" },
                    new Kategoria { Name = "Főételek" },
                    new Kategoria { Name = "Desszertek" },
                    new Kategoria { Name = "Italok" },
                    new Kategoria { Name = "Saláták" },
                    new Kategoria { Name = "Snackek" },
                    // Adj hozzá további kategóriákat szükség szerint
                };
                context.Kategoriak.AddRange(kategoriak);
                context.SaveChanges();
            }

            // Ellenőrizzük, hogy az Etelek tábla üres-e
            if (!context.Etelek.Any())
            {
                var e1 = new Etel
                {
                    Name = "Gulyásleves",
                    Calories = 120,
                    Protein = 7,
                    Carbs = 10,
                    Fats = 5
                };
                var e2 = new Etel
                {
                    Name = "Rakott krumpli",
                    Calories = 150,
                    Protein = 5,
                    Carbs = 20,
                    Fats = 6
                };
                var e3 = new Etel
                {
                    Name = "Somlói galuska",
                    Calories = 250,
                    Protein = 4,
                    Carbs = 30,
                    Fats = 10
                };
                var e4 = new Etel
                {
                    Name = "Narancslé",
                    Calories = 45,
                    Protein = 1,
                    Carbs = 10,
                    Fats = 0
                };
                var e5 = new Etel
                {
                    Name = "Caesar saláta",
                    Calories = 180,
                    Protein = 8,
                    Carbs = 12,
                    Fats = 10
                };
                var e6 = new Etel
                {
                    Name = "Sós pogácsa",
                    Calories = 80,
                    Protein = 3,
                    Carbs = 10,
                    Fats = 4
                };
                // Adj hozzá további ételeket szükség szerint

                context.Etelek.AddRange(e1, e2, e3, e4, e5, e6);
                context.SaveChanges();

                // Kategóriák hozzárendelése (EtelKategoria)
                // Keressük meg a kategóriák ID-ját
                var levesKategoria = context.Kategoriak.FirstOrDefault(k => k.Name == "Levesek");
                var foeKategoria = context.Kategoriak.FirstOrDefault(k => k.Name == "Főételek");
                var desszertKategoria = context.Kategoriak.FirstOrDefault(k => k.Name == "Desszertek");
                var italKategoria = context.Kategoriak.FirstOrDefault(k => k.Name == "Italok");
                var salataKategoria = context.Kategoriak.FirstOrDefault(k => k.Name == "Saláták");
                var snackKategoria = context.Kategoriak.FirstOrDefault(k => k.Name == "Snackek");

                // Hozzárendelés
                if (levesKategoria != null && e1 != null)
                {
                    context.EtelKategoriak.Add(new EtelKategoria
                    {
                        FoodId = e1.FoodId,
                        CategoryId = levesKategoria.CategoryId
                    });
                }
                if (foeKategoria != null && e2 != null)
                {
                    context.EtelKategoriak.Add(new EtelKategoria
                    {
                        FoodId = e2.FoodId,
                        CategoryId = foeKategoria.CategoryId
                    });
                }
                if (desszertKategoria != null && e3 != null)
                {
                    context.EtelKategoriak.Add(new EtelKategoria
                    {
                        FoodId = e3.FoodId,
                        CategoryId = desszertKategoria.CategoryId
                    });
                }
                if (italKategoria != null && e4 != null)
                {
                    context.EtelKategoriak.Add(new EtelKategoria
                    {
                        FoodId = e4.FoodId,
                        CategoryId = italKategoria.CategoryId
                    });
                }
                if (salataKategoria != null && e5 != null)
                {
                    context.EtelKategoriak.Add(new EtelKategoria
                    {
                        FoodId = e5.FoodId,
                        CategoryId = salataKategoria.CategoryId
                    });
                }
                if (snackKategoria != null && e6 != null)
                {
                    context.EtelKategoriak.Add(new EtelKategoria
                    {
                        FoodId = e6.FoodId,
                        CategoryId = snackKategoria.CategoryId
                    });
                }

                context.SaveChanges();
            }

            // További seed adatok hozzáadása, pl. HetiEtrendek, Felhasználók, stb.
            // ...
        }
    }
}
