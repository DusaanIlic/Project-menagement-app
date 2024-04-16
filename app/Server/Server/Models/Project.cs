using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProjectId { get; set; }
        
        [Required]
        public string ProjectName { get; set; } = string.Empty;

        [Required]
        public string ProjectDescription { get; set; } = string.Empty;

        [Required]
        public DateTime Deadline { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public int ProjectStatusId { get; set; }

        public ProjectStatus ProjectStatus { get; set; }

        public int? TeamLeaderId { get; set; }
        public Member TeamLeader { get; set; }

        public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
        
        public ICollection<ProjectTaskStatus> ProjectTaskStatuses { get; set; } = new List<ProjectTaskStatus>();

        public ICollection<MemberProject> MemberProjects { get; set; } = new List<MemberProject>();
        
        public ICollection<ProjectProjectRole> ProjectRoleAssociations { get; set; } = new List<ProjectProjectRole>();
    }
}
