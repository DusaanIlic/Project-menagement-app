using Server.Models;

namespace Server.DataTransferObjects
{
    public class ProjectDTO
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string ProjectDescription { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public int ProjectStatusId { get; set; }
        public string Status { get; set; } = string.Empty;
        public ICollection<ProjectTaskDTO> ProjectTasks { get; set; }
    }
}
