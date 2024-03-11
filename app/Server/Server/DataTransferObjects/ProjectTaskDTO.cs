namespace Server.DataTransferObjects
{
    public class ProjectTaskDTO
    {
        public int TaskId { get; set; }
        public string TaskName { get; set; }
        public string TaskDescription { get; set; }
        public DateTime DeadLine { get; set; }
        public int ProjectId { get; set; }
    }
}
