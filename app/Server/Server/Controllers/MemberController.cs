using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
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
                FirstName = m.FirstName,
                LastName = m.LastName,
                Email = m.Email,
                Role = m.Role,
                DateAdded = m.DateAdded,
                Country = m.Country,
                City = m.City,
                Status = m.Status,
                Github = m.Status,
                Linkedin = m.Linkedin,
                PhoneNumber = m.PhoneNumber,
                DateOfBirth = m.DateOfBirth
            }).ToList();
            return Ok(memberDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddMember(AddMemberRequest memberDTO)
        {
            var existingMember = await dbContext.Members.FirstOrDefaultAsync(m => m.Email == memberDTO.Email);

            if (existingMember != null)
            {
                return Conflict();
            }
            
            String randomPassword = GenerateRandomPassword(8);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(randomPassword);

            var member = new Member
            {
                FirstName = memberDTO.FirstName,
                LastName = memberDTO.LastName,
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
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                Role = member.Role,
                DateAdded = member.DateAdded,
                Country = member.Country,
                City = member.City,
                Status = member.Status,
                Github = member.Status,
                Linkedin = member.Linkedin,
                PhoneNumber = member.PhoneNumber,
                DateOfBirth = member.DateOfBirth
            };

            var request = new EmailDTO
            {
                To = memberDTO.Email,
                Subject = "Welcome to LogicTenacity - Your Account Details",
                Body = $@"
                <p>Hello {memberDTO.FirstName} {memberDTO.LastName},</p>
                
                <p>We are delighted to welcome you to LogicTenacity! Your account has been successfully created, and we're excited to have you on board.</p>
                
                <p>Below are your account details:</p>
                
                <ul>
                    <li><strong>Email:</strong> {memberDTO.Email}</li>
                    <li><strong>Temporary Password:</strong> {randomPassword}</li>
                </ul>
                
                <p>For security reasons, we recommend that you change your password as soon as possible after logging in for the first time. Please follow these steps to set up your new password:</p>
                
                <ol>
                    <li>Visit our website at <a href=""http://localhost:4200"" target=""_blank"">this link<a/>.</li>
                    <li>Click on the ""Login"" button.</li>
                    <li>Enter your username/email and the temporary password provided above.</li>
                    <li>Follow the prompts to create a new, secure password.</li>
                </ol>
                                
                <p>Once again, welcome to the LogicTenacity family! We look forward to working with you.</p>"
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
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                Role = member.Role,
                DateAdded = member.DateAdded,
                Country = member.Country,
                City = member.City,
                Status = member.Status,
                Github = member.Status,
                Linkedin = member.Linkedin,
                PhoneNumber = member.PhoneNumber,
                DateOfBirth = member.DateOfBirth
            };

            return Ok(memberDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, MemberDTO memberDTO)
        {
            var member = await dbContext.Members.FindAsync(id);
            var isAdmin = User.IsInRole("admin");

            if (member == null)
            {
                return NotFound();
            }

            if (member.Id != id && !isAdmin)
            {
                return Forbid();
            }

            member.Id = memberDTO.Id;
            member.FirstName = memberDTO.FirstName;
            member.LastName = memberDTO.LastName;
            member.Email = memberDTO.Email;
            member.Role = memberDTO.Role;
            member.DateAdded = memberDTO.DateAdded;
            member.Country = memberDTO.Country;
            member.City = memberDTO.City;
            member.Status = memberDTO.Status;
            member.Github = memberDTO.Status;
            member.Linkedin = memberDTO.Linkedin;
            member.PhoneNumber = memberDTO.PhoneNumber;
            member.DateOfBirth = memberDTO.DateOfBirth;

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
        
        public static string GenerateRandomPassword(int length)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+";
            StringBuilder password = new StringBuilder();
            
            byte[] randomBytes = RandomNumberGenerator.GetBytes(length);
            
            for (int i = 0; i < length; i++)
            {
                password.Append(validChars[randomBytes[i] % validChars.Length]);
            }

            return password.ToString();
        }
    }
}
