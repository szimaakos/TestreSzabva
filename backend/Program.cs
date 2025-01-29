using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TestreSzabva.Data;
using TestreSzabva.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Adatbázis-szolgáltatás regisztrálása (SQLite)
builder.Services.AddDbContext<TestreSzabvaContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. CORS beállítása
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policyBuilder =>
    {
        policyBuilder
            .WithOrigins("http://localhost:5173") // Fejlesztésben a React alapértelmezett portja
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// 3. Identity + EF store + jelszó szabályok
builder.Services.AddIdentity<Felhasznalo, IdentityRole>(options =>
{
    // Jelszó szabályok éles környezethez
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<TestreSzabvaContext>()
.AddDefaultTokenProviders();

// 4. JWT Auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
})
.AddJwtBearer("Bearer", options =>
{
    options.RequireHttpsMetadata = true; // Éles környezetben HTTPS szükséges
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// 5. MVC/Web API szolgáltatások
builder.Services.AddControllers();

// 6. Swagger (Csak fejlesztési környezetben)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TestreSzabva API",
        Version = "v1"
    });
});

var app = builder.Build();

// 7. Middleware konfiguráció
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactPolicy");

// FONTOS: Elõször Auth, aztán Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SeedData csak fejlesztési környezetben
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<TestreSzabvaContext>();
            context.Database.Migrate(); // Lefuttatja a migrációkat
            SeedData.Initialize(context); // Seed data betöltése
        }
        catch (Exception ex)
        {
            // Logolhatod a hibát vagy kezelheted
            Console.WriteLine($"Hiba a seeding során: {ex.Message}");
        }
    }
}

app.Run();
