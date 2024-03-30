using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Server.Models
{
    public class Member
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Full name is required.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required.")]
        public string Role { get; set; } = string.Empty;

        public String Linkedin { get; set; } = String.Empty;

        public String Github { get; set; } = String.Empty;

        public String Status { get; set; } = String.Empty;

        public String PhoneNumber { get; set; } = String.Empty;
        
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
        
        public int AvatarId { get; set; }
        
        public File Avatar { get; set; }
        
        public ICollection<Project> ProjectsLead { get; set; } = new List<Project>();

        public ICollection<MemberTask> Tasks { get; set; } = new List<MemberTask>();

        public ICollection<File> UploadedFiles { get; set; } = new List<File>();
    }
}
