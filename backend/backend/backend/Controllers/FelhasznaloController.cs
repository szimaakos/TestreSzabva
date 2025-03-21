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
                "E-mail megerősítése - TestreSzabva",
                $"<h2>Köszönjük, hogy regisztráltál a TestreSzabva alkalmazásba!</h2>" +
                $"<p>Kérjük, kattints az alábbi linkre az e-mail címed megerősítéséhez:</p>" +
                $"<p><a href='{confirmUrl}'>E-mail megerősítése</a></p>" +
                $"<p>Ha nem te regisztráltál, kérjük, hagyd figyelmen kívül ezt az e-mailt.</p>" +
                $"<p>Üdvözlettel,<br>TestreSzabva csapat</p>"
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