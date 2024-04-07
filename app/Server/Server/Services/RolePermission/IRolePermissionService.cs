using System.Security.Claims;

namespace Server.Services.RolePermission
{
    public interface IRolePermissionService
    {
        Task<bool> CheckRolePermission(int roleId, int permissionId);

        Task<int?> CheckRole(int userId);
      
    }
}
