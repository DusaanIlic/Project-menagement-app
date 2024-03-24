using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class ProjectTask
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskId { get; set; }

        public string TaskName { get; set; } = string.Empty;

        public string TaskDescription { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public int ProjectTaskStatusId { get; set; }
        public ProjectTaskStatus ProjectTaskStatus { get; set; }

        public int TaskPriorityId { get; set; }
        public TaskPriority TaskPriority { get; set; }

        public ICollection<MemberTask> Members { get; set; } = new List<MemberTask>();
    }
}
