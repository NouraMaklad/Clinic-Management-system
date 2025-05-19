using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ClinicManagementSystem.API.Data;
using ClinicManagementSystem.API.Models;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace ClinicManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ClinicDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] Admin admin)
        {
            if (admin == null || string.IsNullOrEmpty(admin.Username) || string.IsNullOrEmpty(admin.PasswordHash))
            {
                return BadRequest("Username and password are required.");
            }

            if (_context.Admins.Any(a => a.Username == admin.Username))
            {
                return BadRequest("Username already exists.");
            }

            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(admin.PasswordHash);
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
            return Ok("Admin registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Admin admin)
        {
            if (admin == null || string.IsNullOrEmpty(admin.Username) || string.IsNullOrEmpty(admin.PasswordHash))
            {
                return BadRequest("Username and password are required.");
            }

            var existingAdmin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == admin.Username);
            if (existingAdmin == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            try
            {
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(admin.PasswordHash, existingAdmin.PasswordHash);
                if (!isPasswordValid)
                {
                    return Unauthorized("Invalid credentials.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error verifying password", details = ex.Message });
            }

            var token = GenerateJwtToken(existingAdmin);
            return Ok(new { token });
        }

        private string GenerateJwtToken(Admin admin)
        {
            if (admin.Username == null)
            {
                throw new ArgumentNullException(nameof(admin.Username), "Username cannot be null");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, admin.Username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var jwtKey = _configuration["Jwt:Key"] ?? "YourSuperSecretKey12345!@#$%ThisShouldBeVeryVeryLongToBeSecure";
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}