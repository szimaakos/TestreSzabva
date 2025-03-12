using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
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
        public DbSet<MealFood> MealFoods { get; set; }
        public DbSet<ProgressRecord> ProgressRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProgressRecord>()
        .HasOne(p => p.User)
        .WithMany()
        .HasForeignKey(p => p.UserId)
        .OnDelete(DeleteBehavior.Cascade);

            // HetiEtrend: a PlanId automatikus generálása
            modelBuilder.Entity<HetiEtrend>()
                .Property(he => he.PlanId)
                .ValueGeneratedOnAdd();

            // Felhasznalo konfigurációja
            modelBuilder.Entity<Felhasznalo>()
                .HasKey(f => f.Id);

            modelBuilder.Entity<Felhasznalo>()
                .Property(f => f.GoalDate)
                .IsRequired(false);

            modelBuilder.Entity<Felhasznalo>()
                .Property(f => f.CalorieGoal)
                .IsRequired(false);

            // Etel konfigurációja
            modelBuilder.Entity<Etel>()
                .HasKey(e => e.FoodId);

            // Kategoria konfigurációja
            modelBuilder.Entity<Kategoria>()
                .HasKey(k => k.CategoryId);

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

            // HetiEtrend és Felhasznalo kapcsolata:
            // Mivel a HetiEtrend nem tartalmaz közvetlen navigációs property-t a Felhasználóra,
            // használjuk az overload-t, hogy a foreign key (UserId) alapján kapcsolódjon.
            modelBuilder.Entity<HetiEtrend>()
                .HasOne<Felhasznalo>()
                .WithMany(f => f.HetiEtrendek)
                .HasForeignKey(he => he.UserId)
                .HasPrincipalKey(f => f.Id);

            // MealFood és HetiEtrend kapcsolata:
            modelBuilder.Entity<MealFood>()
                .HasOne(mf => mf.MealSlot)
                .WithMany(m => m.MealFoods)
                .HasForeignKey(mf => mf.MealSlotId);

            // Enum-string konverziók
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