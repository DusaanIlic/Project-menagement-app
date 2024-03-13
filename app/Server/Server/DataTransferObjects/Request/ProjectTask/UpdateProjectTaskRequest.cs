namespace Server.DataTransferObjects.Request.ProjectTask
{
    public class UpdateProjectTaskRequest
    {
        public DateTime DeadLine { get; set; }
        public string TaskDescription { get; set; }
        public string TaskName { get; set; }
    }
}
