namespace Server.Services.RolePermission
{
    public interface IRolePermissionService
    {
        Task<bool> CheckRolePermission(int roleId, int permissionId);
    }
}
