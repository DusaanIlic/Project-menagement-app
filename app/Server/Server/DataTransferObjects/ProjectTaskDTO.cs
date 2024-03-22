namespace Server.DataTransferObjects
{
    public class ProjectTaskDTO
    {
        public int TaskId { get; set; }
        public string TaskName { get; set; }
        public string TaskDescription { get; set; }
        public int StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public int ProjectId { get; set; }
        public string TaskStatus { get; set; }
        public int TaskStatusId { get; set; }
        public int TaskPriorityId { get; set; }
    }
}
