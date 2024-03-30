namespace Server.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }

        public ICollection<Member> Members { get; set; } = new List<Member>();
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
