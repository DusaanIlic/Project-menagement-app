using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class TaskCategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskCategoryID { get; set; }
        public string CategoryName { get; set; }

        public List<ProjectTask> ProjectTasks { get; set; }
    }
}
