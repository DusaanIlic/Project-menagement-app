using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class ProjectTaskStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<ProjectTask> ProjectTasks { get; set; } = new List<ProjectTask>();
    }
}
