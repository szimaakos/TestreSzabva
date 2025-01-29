using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TestreSzabva.Models;

namespace TestreSzabva.Data
{
    public class TestreSzabvaContext : IdentityDbContext<Felhasznalo>
    {
        public TestreSzabvaContext(DbContextOptions<TestreSzabvaContext> options)
            : base(options)
        {
        }

        public DbSet<Etel> Etelek { get; set; }
        public DbSet<Kategoria> Kategoriak { get; set; }
        public DbSet<HetiEtrend> HetiEtrendek { get; set; }
        public DbSet<EtelKategoria> EtelKategoriak { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Felhasznalo (IdentityUser alap)
            modelBuilder.Entity<Felhasznalo>()
                .HasKey(f => f.Id);

            // Etel
            modelBuilder.Entity<Etel>()
                .HasKey(e => e.FoodId);

            // Kategoria
            modelBuilder.Entity<Kategoria>()
                .HasKey(k => k.CategoryId);

            // EtelKategoria (kapcsoló tábla)
            modelBuilder.Entity<EtelKategoria>()
                .HasKey(ek => new { ek.FoodId, ek.CategoryId });

            modelBuilder.Entity<EtelKategoria>()
                .HasOne(ek => ek.Etel)
                .WithMany(e => e.EtelKategoriak)
                .HasForeignKey(ek => ek.FoodId);

            modelBuilder.Entity<EtelKategoria>()
                .HasOne(ek => ek.Kategoria)
                .WithMany(k => k.EtelKategoriak)
                .HasForeignKey(ek => ek.CategoryId);

            // HetiEtrend
            modelBuilder.Entity<HetiEtrend>()
                .HasKey(he => he.PlanId);

            modelBuilder.Entity<HetiEtrend>()
                .HasOne(he => he.Felhasznalo)
                .WithMany(f => f.HetiEtrendek)
                .HasForeignKey(he => he.UserId)
                .HasPrincipalKey(f => f.Id);

            modelBuilder.Entity<HetiEtrend>()
                .HasOne(he => he.Etel)
                .WithMany(e => e.HetiEtrendek)
                .HasForeignKey(he => he.FoodId);

            // Enum-jellegű string mezők
            modelBuilder.Entity<Felhasznalo>()
                .Property(f => f.Gender)
                .HasConversion<string>();

            modelBuilder.Entity<Felhasznalo>()
                .Property(f => f.ActivityLevel)
                .HasConversion<string>();

            modelBuilder.Entity<HetiEtrend>()
                .Property(he => he.DayOfWeek)
                .HasConversion<string>();

            modelBuilder.Entity<HetiEtrend>()
                .Property(he => he.MealTime)
                .HasConversion<string>();
        }
    }
}
