using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;
        private readonly IConfiguration _configuration;

        public AuthController(LogicTenacityDbContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this._configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            var member = await dbContext.Members.Include(m=>m.Role).FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

            if (member == null)
            {
                return NotFound();
            }

            if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, member.Password))
            {
                return Unauthorized();
            }

            var token = GenerateJwtToken(member);

             var memberResponse = new MemberDTO
            {
                Id = member.Id,
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                RoleId = member.RoleId,
                DateAdded = member.DateAdded,
                Country = member.Country,
                City = member.City,
                Status = member.Status,
                Github = member.Status,
                Linkedin = member.Linkedin,
                PhoneNumber = member.PhoneNumber,
                DateOfBirth = member.DateOfBirth,
                RoleName = member.Role.RoleName
            };

            return Ok(new { Token = token, member = memberResponse });
        }

        private string GenerateJwtToken(Member member)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, member.Email),
                    new Claim(ClaimTypes.Role, member.Role.RoleName),
                    new Claim("Id", member.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _configuration["JwtSettings:Audience"],
                Issuer = _configuration["JwtSettings:Issuer"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
