using Microsoft.EntityFrameworkCore;
using Server.Data;

namespace Server.Services.Permission;

public class PermissionService : IPermissionService
{
    private readonly LogicTenacityDbContext _dbContext;

    public PermissionService(LogicTenacityDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<bool> HasGlobalPermissionAsync(int memberId, string permissionName)
    {
        try
        {
            return await _dbContext.Members
                .Where(m => m.Id == memberId)
                .Join(_dbContext.RolePermissions, 
                    member => member.RoleId, 
                    rp => rp.RoleId, 
                    (member, rp) => rp.Permission)
                .AnyAsync(p => p.PermissionName == permissionName);
        }
        catch (Exception ex)
        {
            // Handle exception
            throw new ApplicationException("Error checking global permission.", ex);
        }
    }

    public async Task<bool> HasProjectPermissionAsync(int memberId, int projectId, string permissionName)
    {
        try
        {
            return await _dbContext.MemberProjects
                .Where(mp => mp.MemberId == memberId && mp.ProjectId == projectId)
                .Join(_dbContext.ProjectRolePermissions, 
                    mp => mp.ProjectRoleId, 
                    ppr => ppr.ProjectRoleId, 
                    (mp, ppr) => ppr.ProjectPermission)
                .AnyAsync(p => p.Name == permissionName);
        }
        catch (Exception ex)
        {
            // Handle exception
            throw new ApplicationException("Error checking project permission.", ex);
        }
    }
}