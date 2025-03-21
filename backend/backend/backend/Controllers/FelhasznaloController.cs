using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Web;
using backend.Models;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FelhasznaloController : ControllerBase
    {
        private readonly UserManager<Felhasznalo> _userManager;
        private readonly SignInManager<Felhasznalo> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;

        public FelhasznaloController(
            UserManager<Felhasznalo> userManager,
            SignInManager<Felhasznalo> signInManager,
            IConfiguration configuration,
            IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailSender = emailSender;
        }

        // ====== REGISTER (módosított) ======
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Ellenőrizzük, hogy létezik-e már a felhasználó az adott e-maillel.
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return Conflict("USER_EXISTS");
            }

            // Létrehozzuk az Identity felhasználót
            var user = new Felhasznalo
            {
                UserName = dto.UserName,
                Email = dto.Email,
                NormalizedEmail = dto.Email.ToUpperInvariant(),
                EmailConfirmed = false
            };

            // Jelszó beállítása
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // E-mail megerősítési token generálása
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = HttpUtility.UrlEncode(token);

            // E-mail megerősítési link összeállítása
            var frontendUrl = _configuration["FrontendUrl"];
            var confirmUrl = $"http://localhost:5162/api/Felhasznalo/ConfirmEmail?userId={user.Id}&token={encodedToken}";

            // E-mail küldése
            await _emailSender.SendEmailAsync(
    user.Email,
    "Erősítsd meg e-mail címed és kezdd el a személyre szabott élményt - TestreSzabva",
    $@"<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {{
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .header h1 {{
            color: #e30b5c;
            margin-bottom: 5px;
        }}
        .content {{
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
        }}
        .button {{
            display: inline-block;
            background-color: #e30b5c;
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
        }}
        button a {{
            text-decoration: none;
            color: white;
        }}
        .footer {{
            font-size: 14px;
            color: #666;
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }}
    </style>
</head>
<body>
    <div class='header'>
        <h1>Üdvözlünk <strong>{user.UserName}</strong> a TestreSzabva világában!</h1>
    </div>
    
    <div class='content'>
        
        <p>Köszöntünk a TestreSzabva közösségében! Már csak egy lépés választ el attól, hogy teljes mértékben kihasználhasd az alkalmazás által nyújtott személyre szabott élményt.</p>
        
        <p style='text-align: center;'>
            <a href='{confirmUrl}' class='button'>E-mail cím megerősítése</a>
        </p>
        
        <p>Az e-mail címed megerősítésével:</p>
        <ul>
            <li>Hozzáférsz az összes személyre szabott szolgáltatásunkhoz</li>
            <li>Biztonságban tudhatod fiókodat</li>
            <li>Értesülhetsz a legújabb fejlesztéseinkről és ajánlatainkról</li>
        </ul>
        
        <p>Ha nem te regisztráltál oldalunkon, kérjük, hagyd figyelmen kívül ezt az üzenetet.</p>
    </div>
    
    <div class='footer'>
        <p>Köszönjük, hogy minket választottál!</p>
        <p>Üdvözlettel,<br>A TestreSzabva csapata</p>
        <p><small>© 2025 TestreSzabva. Minden jog fenntartva.</small></p>
    </div>
</body>
</html>"
);

            // Sikeres regisztráció -> 201 Created
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new { user.Id, user.UserName, user.Email });
        }

        // ====== CONFIRM EMAIL (új) ======
        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto dto)
        {
            if (string.IsNullOrEmpty(dto.UserId) || string.IsNullOrEmpty(dto.Token))
            {
                return BadRequest("Érvénytelen felhasználó azonosító vagy token.");
            }

            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
            {
                return NotFound("Felhasználó nem található.");
            }

            var decodedToken = HttpUtility.UrlDecode(HttpUtility.UrlDecode(dto.Token));
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (result.Succeeded)
            {
                return Ok(new { success = true, message = "Email sikeresen megerősítve." });
            }

            return BadRequest("Hiba történt az e-mail megerősítésekor.");
        }

        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmailGet([FromQuery] string userId, [FromQuery] string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
            {
                return BadRequest("Érvénytelen felhasználó azonosító vagy token.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Felhasználó nem található.");
            }

            try
            {
                // Cseréljük le a szóközöket '+' karakterre
                token = token.Replace(" ", "+");

                var result = await _userManager.ConfirmEmailAsync(user, token);

                if (result.Succeeded)
                {
                    return Redirect($"{_configuration["FrontendUrl"]}/email-confirmed");
                }

                return BadRequest("Hiba történt az e-mail megerősítésekor.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Kivétel történt: {ex.Message}");
            }
        }

        // ====== LOGIN (módosított) ======
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return Unauthorized("Hibás email vagy jelszó.");
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid)
            {
                return Unauthorized("Hibás email vagy jelszó.");
            }

            // Ellenőrizzük, hogy az e-mail meg van-e erősítve
            if (!user.EmailConfirmed)
            {
                return Unauthorized("Az e-mail cím még nincs megerősítve. Kérjük, ellenőrizd a postaládád.");
            }

            var token = GenerateJwtToken(user);

            // Token és UserId visszaküldése
            return Ok(new
            {
                Token = token,
                UserId = user.Id
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("Azonosító eltérés.");
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("Felhasználó nem található.");
            }

            // Frissítsd a szükséges tulajdonságokat
            user.Weight = dto.Weight;
            user.Height = dto.Height;
            user.Age = dto.Age;
            user.Gender = dto.Gender;
            user.ActivityLevel = dto.ActivityLevel;
            user.GoalWeight = dto.GoalWeight;
            user.GoalDate = dto.GoalDate;
            user.IsProfileComplete = dto.IsProfileComplete;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { success = true, message = "Profil sikeresen frissítve." });
        }

        // ====== A többi metódus változatlan marad ======
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            // Meglévő metódus
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.IsProfileComplete,
                user.Weight,
                user.Height,
                user.Age,
                user.Gender,
                user.ActivityLevel,
                user.GoalWeight,
                user.GoalDate,
                user.CalorieGoal,
                user.EmailConfirmed
            });
        }

        // Többi metódus (UpdateUser, DeleteUser) változatlan

        // JWT token generálása (meglévő metódus)
        private string GenerateJwtToken(Felhasznalo user)
        {
            // Meglévő metódus
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(securityToken);
        }
    }
}