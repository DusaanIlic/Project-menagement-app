namespace Server.DataTransferObjects.Request.ProjectTask
{
    public class AddProjectTaskRequest
    {
        public string TaskName { get; set; }
        public string TaskDescription { get; set; }
        public DateTime DeadLine { get; set; }
        public int ProjectId { get; set; }
    }
}
