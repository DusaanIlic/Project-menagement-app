using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [Authorize(Roles="admin")]
    [Route("api/[controller]")]
    [ApiController]
    
    public class MemberController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;
        private readonly IEmailService _emailService;

        public MemberController(LogicTenacityDbContext dbContext, IEmailService emailService)
        {
            this.dbContext = dbContext;
            this._emailService = emailService;
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
                DateAdded = DateTime.UtcNow
            };

            dbContext.Members.Add(member);
            await dbContext.SaveChangesAsync();

            var memberResponse = new MemberDTO
            {
                Id = member.Id,
                FullName = member.FullName,
                Email = member.Email,
                DateAdded = member.DateAdded
            };

            var request = new EmailDTO
            {
                To = memberDTO.Email,
                Subject = "Welcome to LogicTeancity - Your Account Details",
                Body = $@"
                <p>Hello {memberDTO.FullName},</p>
                
                <p>We are delighted to welcome you to LogicTeancity! Your account has been successfully created, and we're excited to have you on board.</p>
                
                <p>Below are your account details:</p>
                
                <ul>
                    <li><strong>Username/Email:</strong> {memberDTO.Email}</li>
                    <li><strong>Temporary Password:</strong> {memberDTO.Password}</li>
                </ul>
                
                <p>For security reasons, we recommend that you change your password as soon as possible after logging in for the first time. Please follow these steps to set up your new password:</p>
                
                <ol>
                    <li>Visit our website at <a href=""http://localhost:4200"" target=""_blank"">this link<a/>.</li>
                    <li>Click on the ""Login"" button.</li>
                    <li>Enter your username/email and the temporary password provided above.</li>
                    <li>Follow the prompts to create a new, secure password.</li>
                </ol>
                                
                <p>Once again, welcome to the LogicTeancity family! We look forward to working with you.</p>"
            };


            _emailService.SendEmail(request);

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
