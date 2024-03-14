using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProjectId { get; set; }
    
        public string ProjectName { get; set; } = string.Empty;

        public string ProjectDescription { get; set; } = string.Empty;

        public DateTime DeadLine { get; set; }

        public int ProjectStatusId { get; set; }

        public ProjectStatus ProjectStatus { get; set; }

        public ICollection<ProjectTask> ProjectTasks { get; set; }
    }
}
