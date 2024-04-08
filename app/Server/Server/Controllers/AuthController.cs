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
using Server.Services.JwtBlacklistService;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly LogicTenacityDbContext _dbContext;
        private readonly IJwtService _jwtService;

        public AuthController(LogicTenacityDbContext dbContext, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            var member = await _dbContext.Members.Include(m=>m.Role).FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

            if (member == null)
            {
                return NotFound();
            }

            if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, member.Password))
            {
                return Unauthorized();
            }

            var token = await _jwtService.GenerateToken(member);

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
    }
}
