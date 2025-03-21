using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity.UI.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Adatbazis-szolgaltatas regisztralasa (SQLite)
builder.Services.AddDbContext<TestreSzabvaContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Email szolgáltatás regisztrálása - ha van saját email szolgáltatás
builder.Services.AddTransient<IEmailService, EmailService>();

// Microsoft.AspNetCore.Identity.UI.Services.IEmailSender regisztrálása
builder.Services.AddTransient<IEmailSender, EmailSender>();

// 2. CORS beallitasa
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policyBuilder =>
    {
        policyBuilder
            .WithOrigins("http://localhost:5173") // Fejlesztesben a React alapartelmezett portja
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// 3. Identity + EF store + jelszo szabalyok
builder.Services.AddIdentity<Felhasznalo, IdentityRole>(options =>
{
    // Email options
    options.SignIn.RequireConfirmedEmail = true;
    options.User.RequireUniqueEmail = true;

    // Password options
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
    options.RequireHttpsMetadata = false;
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

// 5. MVC/Web API szolgaltatasok
builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Ezzel biztositod, hogy a JSON kimenet a camelCase konvenciot hasznalja
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    // Ha nincs szukseg a cikluskezelesre, vagy a MealSlot navigacios property mar [JsonIgnore]-al van ellatva,
    // hasznalhatod az IgnoreCycles opciot, hogy elkereld a ciklusokat.
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// 6. Swagger (Csak fejlesztesi kornyezetben)
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

// 7. Middleware konfiguracio
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactPolicy");

// FONTOS: Eloszor Auth, aztan Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SeedData csak fejlesztesi kornyezetben
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<TestreSzabvaContext>();
            context.Database.Migrate(); // Lefuttatja a migracikat
            SeedData.Initialize(context); // Seed data betoltese
        }
        catch (Exception ex)
        {
            // Logolhatod a hibat vagy kezelheted
            Console.WriteLine($"Hiba a seeding során: {ex.Message}");
        }
    }
}

app.Run();