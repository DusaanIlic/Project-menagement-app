using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public MemberController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {
            var members = await dbContext.Members.ToListAsync();
            var memberDTOs = members.Select(m => new MemberDTO
            {
                Id = m.Id,
                FullName = m.FullName,
                Email = m.Email,
                Role = m.Role,
                DateAdded = m.DateAdded
            }).ToList();
            return Ok(memberDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddMember(AddMemberRequest memberDTO)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(memberDTO.Password);

            var member = new Member
            {
                FullName = memberDTO.FullName,
                Email = memberDTO.Email,
                Password = hashedPassword,
                Role = memberDTO.Role,
                DateAdded = DateTime.UtcNow
            };

            dbContext.Members.Add(member);
            await dbContext.SaveChangesAsync();

            var memberResponse = new MemberDTO
            {
                Id = member.Id,
                FullName = member.FullName,
                Email = member.Email,
                Role = member.Role,
                DateAdded = member.DateAdded
            };

            return Ok(memberResponse);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(int id)
        {
            var member = await dbContext.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            var memberDTO = new MemberDTO
            {
                Id = member.Id,
                FullName = member.FullName,
                Email = member.Email,
                Role = member.Role,
                DateAdded = member.DateAdded
            };

            return Ok(memberDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, MemberDTO memberDTO)
        {
            var member = await dbContext.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            member.FullName = memberDTO.FullName;
            member.Email = memberDTO.Email;
            member.Role = memberDTO.Role;

            await dbContext.SaveChangesAsync();

            // Return the updated member DTO
            return Ok(memberDTO);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await dbContext.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            dbContext.Members.Remove(member);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
