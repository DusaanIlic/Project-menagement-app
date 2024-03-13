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

        public DateTime DeadLine { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

    }
}
