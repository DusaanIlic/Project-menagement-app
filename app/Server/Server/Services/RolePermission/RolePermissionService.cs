
using Microsoft.EntityFrameworkCore;
using Server.Data;

namespace Server.Services.RolePermission
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly LogicTenacityDbContext dbContext;

        public RolePermissionService(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<bool> CheckRolePermission(int roleId, int permissionId)
        {
            return await dbContext.RolePermissions
                .AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        }
    }
}
