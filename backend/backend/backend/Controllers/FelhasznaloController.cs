using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FelhasznaloController : ControllerBase
    {
        private readonly UserManager<Felhasznalo> _userManager;
        private readonly SignInManager<Felhasznalo> _signInManager;
        private readonly IConfiguration _configuration;

        public FelhasznaloController(
            UserManager<Felhasznalo> userManager,
            SignInManager<Felhasznalo> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // ====== REGISTER (meglévő metódus) ======
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Ellenőrizzük, hogy létezik-e már a felhasználó az adott e-maillel.
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return Conflict("Email already in use.");
            }

            // Létrehozzuk az Identity felhasználót
            var user = new Felhasznalo
            {
                UserName = dto.UserName,
                Email = dto.Email,
                NormalizedEmail = dto.Email.ToUpperInvariant() // Normalizálás
            };

            // Jelszó beállítása
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Sikeres regisztráció -> 201 Created
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // ====== LOGIN (új metódus) ======
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

            var token = GenerateJwtToken(user);

            // Token és UserId visszaküldése
            return Ok(new
            {
                Token = token,
                UserId = user.Id
            });
        }

        // ====== GET BY ID (meglévő metódus) ======
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Bővített DTO visszaadása
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
                user.GoalDate,     // Új: céldátum
                user.CalorieGoal   // Új: kiszámított kalória cél
            });
        }

        // ====== UPDATE USER (meglévő metódus) ======
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] Felhasznalo updatedUser)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Frissítjük a meglévő mezőket
            user.Weight = updatedUser.Weight;
            user.Height = updatedUser.Height;
            user.Age = updatedUser.Age;
            user.Gender = updatedUser.Gender;
            user.ActivityLevel = updatedUser.ActivityLevel;
            user.GoalWeight = updatedUser.GoalWeight;
            user.GoalDate = updatedUser.GoalDate;
            user.CalorieGoal = updatedUser.CalorieGoal;
            user.IsProfileComplete = true;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        // ====== DELETE USER (meglévő metódus) ======
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        // ====== JWT TOKEN GENERÁLÁSA (segédfüggvény) ======
        private string GenerateJwtToken(Felhasznalo user)
        {
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

    // ====== LOGIN DTO ======
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
