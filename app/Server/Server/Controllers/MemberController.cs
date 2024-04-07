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
using Server.DataTransferObjects.Request.File;
using Server.Services.File;
using Server.Services.RolePermission;
using Server.DataTransferObjects.Request.Member;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly LogicTenacityDbContext _dbContext;
        private readonly IEmailService _emailService;
        private readonly IFileService _fileService;
        private readonly IRolePermissionService _rolePermissionService;

        public MemberController(LogicTenacityDbContext dbContext, IEmailService emailService, IFileService fileService, IRolePermissionService rolePermissionService)
        {
            _dbContext = dbContext;
            _emailService = emailService;
            _fileService = fileService;
            _rolePermissionService = rolePermissionService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {

            var members = await _dbContext.Members.Include(m => m.Role).ToListAsync();

            var memberDTOs = members.Select(m => new MemberDTO
            {
                Id = m.Id,
                FirstName = m.FirstName,
                LastName = m.LastName,
                Email = m.Email,
                RoleId = m.RoleId,
                DateAdded = m.DateAdded,
                Country = m.Country,
                City = m.City,
                Status = m.Status,
                Github = m.Github,
                Linkedin = m.Linkedin,
                PhoneNumber = m.PhoneNumber,
                DateOfBirth = m.DateOfBirth,
                RoleName = m.Role.RoleName
            }).ToList();
            return Ok(memberDTOs);
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<IActionResult> AddMember(AddMemberRequest memberDTO)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await _rolePermissionService.CheckRole(userId);

            var hasPermission = await _rolePermissionService.CheckRolePermission(roleId.Value, 1);

            if (!hasPermission)
            {
                return Unauthorized("Insufficient permissions");
            }

            var existingMember = await _dbContext.Members.FirstOrDefaultAsync(m => m.Email == memberDTO.Email);

            if (existingMember != null)
            {
                return Conflict();
            }

            String randomPassword = GenerateRandomPassword(8);
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(randomPassword);

            var role = await _dbContext.Roles.FindAsync(memberDTO.RoleId);

            var member = new Member
            {
                FirstName = memberDTO.FirstName,
                LastName = memberDTO.LastName,
                Email = memberDTO.Email,
                Password = hashedPassword,
                DateAdded = DateTime.UtcNow,
                Role = role
            };

            _dbContext.Members.Add(member);
            await _dbContext.SaveChangesAsync();

            var memberResponse = new MemberDTO
            {
                Id = member.Id,
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                RoleId = role.RoleId,
                DateAdded = member.DateAdded,
                Country = member.Country,
                City = member.City,
                Status = member.Status,
                Github = member.Github,
                Linkedin = member.Linkedin,
                PhoneNumber = member.PhoneNumber,
                DateOfBirth = member.DateOfBirth,
                RoleName = role.RoleName
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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(int id)
        {
            var member = await _dbContext.Members
                         .Include(m => m.Role)
                         .FirstOrDefaultAsync(m => m.Id == id);


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
                RoleId = member.RoleId,
                DateAdded = member.DateAdded,
                Country = member.Country,
                City = member.City,
                Status = member.Status,
                Github = member.Github,
                Linkedin = member.Linkedin,
                PhoneNumber = member.PhoneNumber,
                DateOfBirth = member.DateOfBirth,
                RoleName = member.Role.RoleName
            };

            return Ok(memberDTO);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, UpdateMemberRequest memberDTO)
        {
            var member = await _dbContext.Members.FindAsync(id);
            var isAdmin = User.IsInRole("Administrator");

            if (member == null)
            {
                return NotFound();
            }

            if (member.Id != id && !isAdmin)
            {
                return Unauthorized();
            }

            var emailUsed =
                await _dbContext.Members.FirstOrDefaultAsync(m => m.Email == memberDTO.Email && m.Id != member.Id);

            if (emailUsed != null)
            {
                return Conflict();
            }

            member.FirstName = memberDTO.FirstName;
            member.LastName = memberDTO.LastName;
            member.Email = memberDTO.Email;
            member.Country = memberDTO.Country;
            member.City = memberDTO.City;
            member.Status = memberDTO.Status;
            member.Github = memberDTO.Github;
            member.Linkedin = memberDTO.Linkedin;
            member.PhoneNumber = memberDTO.PhoneNumber;
            member.DateOfBirth = memberDTO.DateOfBirth;

            await _dbContext.SaveChangesAsync();


            return Ok(memberDTO);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await _rolePermissionService.CheckRole(userId);

            var hasPermission = await _rolePermissionService.CheckRolePermission(roleId.Value, 2);

            if (!hasPermission)
            {
                return Unauthorized("Insufficient permissions");
            }

            var member = await _dbContext.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            _dbContext.Members.Remove(member);
            await _dbContext.SaveChangesAsync();

            return Ok("Member deleted");
        }

        [Authorize]
        [HttpGet("{id}/Avatar")]
        public async Task<IActionResult> GetAvatar(int id)
        {
            var member = await _dbContext.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            if (member.AvatarId == null)
            {
                return NotFound();
            }

            var (bytes, mime) = await _fileService.GetFileData(member.AvatarId.Value);

            return File(bytes, mime);
        }

        [Authorize]
        [HttpPost("{id}/Avatar")]
        public async Task<IActionResult> PostAvatar(int id, AddFileRequest addFileRequest)
        {
            var member = await _dbContext.Members.FindAsync(id);
            var isAdmin = User.IsInRole("Administrator");

            if (member == null)
            {
                return NotFound();
            }

            if (member.Id != id && !isAdmin)
            {
                return Unauthorized();
            }

            if (member.AvatarId != null)
            {
                await _fileService.DeleteFile(member.AvatarId.Value);
            }

            var file = await _fileService.PostFileAsync(id, addFileRequest);

            member.AvatarId = file.FileId;
            member.Avatar = file;

            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}/Avatar")]
        public async Task<IActionResult> DeleteAvatar(int id)
        {
            var member = await _dbContext.Members.FindAsync(id);
            var isAdmin = User.IsInRole("Administrator");

            if (member == null)
            {
                return NotFound();
            }

            if (member.Id != id && !isAdmin)
            {
                return Unauthorized();
            }

            if (member.AvatarId != null)
            {
                await _fileService.DeleteFile(member.AvatarId.Value);
                member.AvatarId = null;
            }

            await _dbContext.SaveChangesAsync();

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

        [Authorize]
        [HttpPost("{id}/ChangePassword")]
        public async Task<IActionResult> ChangePassword(int id, PasswordChangeRequest changePasswordRequest)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            if (userId != id)
            {
                return Unauthorized("You are not authorized to change this password");
            }

            var member = await _dbContext.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordRequest.OldPassword, member.Password))
            {
                return BadRequest("Old password is incorrect");
            }

            string hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordRequest.NewPassword);

            member.Password = hashedNewPassword;

            await _dbContext.SaveChangesAsync();

            return Ok("Password changed successfully");
        }

        [Authorize]
        [HttpPost("{id}/ChangeEmail")]
        public async Task<IActionResult> ChangeEmail(int id, EmailChangeRequest changeEmailRequest)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            if (userId != id)
            {
                return Unauthorized("You can only change your own email address");
            }

            var member = await _dbContext.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            if (!BCrypt.Net.BCrypt.Verify(changeEmailRequest.Password, member.Password))
            {
                return BadRequest("Password is incorrect");
            }
            
            var existingMember = await _dbContext.Members.FirstOrDefaultAsync(m => m.Email == changeEmailRequest.NewEmail);

            if (existingMember != null)
            {
                return Conflict("Email address already exists");
            }

            
            member.Email = changeEmailRequest.NewEmail;

            await _dbContext.SaveChangesAsync();

            return Ok("Email address changed successfully");
        }

    }
}
