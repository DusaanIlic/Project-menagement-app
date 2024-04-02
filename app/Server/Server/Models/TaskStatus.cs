using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class TaskStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public ICollection<ProjectTask> ProjectTasks { get; set; }
        
        public ICollection<ProjectTaskStatus> ProjectTaskStatuses { get; set; }
    }
}
