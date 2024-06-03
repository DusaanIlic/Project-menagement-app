namespace Server.DataTransferObjects.Request.ProjectTask
{
    public class UpdateTaskRequestcs
    {
        public DateTime Deadline { get; set; }
        public string TaskDescription { get; set; }
        public string TaskName { get; set; }

        public int TaskStatusId { get; set; }
        public int TaskPriorityId { get; set; }

    }
}
