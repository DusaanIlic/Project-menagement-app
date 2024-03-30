namespace Server.DataTransferObjects
{
    public class MemberDTO
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int RoleId { get; set; } 

        public DateTime DateAdded { get; set; }
    }
}
