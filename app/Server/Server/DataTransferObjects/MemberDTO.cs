using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Server.Models;

namespace Server.DataTransferObjects
{
    public class MemberDTO
    {
        public int Id { get; set; }
        
        public string FirstName { get; set; } = string.Empty;
        
        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int RoleId { get; set; } 
        
        public String Linkedin { get; set; } = String.Empty;

        public String Github { get; set; } = String.Empty;

        public String Status { get; set; } = String.Empty;

        public String PhoneNumber { get; set; } = String.Empty;
        
        public String Country { get; set; } = String.Empty;
        
        public String City { get; set; } = String.Empty;

        public DateTime DateOfBirth { get; set; } = DateTime.UnixEpoch; 

        public DateTime DateAdded { get; set; }
    }
}
