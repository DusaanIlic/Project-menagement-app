namespace Server.DataTransferObjects
{
    public class TaskActivityDTO
    {
        public int TaskActivityId { get; set; }

        public int WorkerId { get; set; }
        
        public int TaskId { get; set; }
        
        public int ProjectId { get; set; }

        public DateTime DateModify { get; set; }
        public string Comment { get; set; }

        public int TaskActivityTypeId { get; set; }
    }
}
