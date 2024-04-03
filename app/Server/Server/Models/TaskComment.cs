using System;

namespace Server.Models
{
    public class TaskComment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }

        public int MemberTaskId { get; set; }
        public MemberTask MemberTask { get; set; }
    }
}
