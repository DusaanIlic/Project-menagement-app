using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.Role;
using Server.Models;

namespace Server.Controllers;

public partial class ProjectController
{
    [HttpGet("Permissions")]
    public async Task<IActionResult> GetAllPermissions()
    {
        var permissions = await dbContext.ProjectPermissions.ToListAsync();

        var permissionDto = permissions.Select(p => new PermissionDTO
        {
            PermissionId = p.Id,
            PermissionName = p.Name
        }).ToList();
        
        return Ok(permissionDto);
    }

    [HttpGet("{projectId}/Roles")]
    public async Task<IActionResult> GetAllRolesFromProject(int projectId)
    {
        var roles = await dbContext.ProjectProjectRoles
            .Where(ppr => ppr.ProjectId == projectId)
            .Include(ppr => ppr.ProjectRole)
                .ThenInclude(pr => pr.ProjectRolePermissions)
                    .ThenInclude(prp => prp.ProjectPermission)
            .ToListAsync();

        if (roles.Count == 0)
        {
            return BadRequest(new { message = "Project with given id not found!" });
        }
        
        var roleDto = roles.Select(r => new RoleDTO
        {
            Id = r.ProjectRole.Id,
            Name = r.ProjectRole.Name,
            IsDefault = r.ProjectRole.IsDefault,
            IsFallback = r.ProjectRole.IsFallback,
            PermissionList = r.ProjectRole.ProjectRolePermissions.Select(prp => new PermissionDTO
            {
                PermissionId = prp.ProjectPermission.Id,
                PermissionName = prp.ProjectPermission.Name
            }).ToList()
        }).ToList();

        return Ok(roleDto);
    }
    
    [HttpGet("{projectId}/Roles/{roleId}")]
    public async Task<IActionResult> GetAllRolesFromProject(int projectId, int roleId)
    {
        var role = await dbContext.ProjectProjectRoles
            .Where(ppr => ppr.ProjectId == projectId && ppr.ProjectRoleId == roleId)
            .Include(ppr => ppr.ProjectRole)
                .ThenInclude(pr => pr.ProjectRolePermissions)
                    .ThenInclude(prp => prp.ProjectPermission)
            .FirstOrDefaultAsync();

        if (role == null)
        {
            return BadRequest(new { message = "Either project not found, or role is not a part of project with given id!" });
        }

        var roleDto = new RoleDTO
        {
            Id = role.ProjectRole.Id,
            Name = role.ProjectRole.Name,
            IsDefault = role.ProjectRole.IsDefault,
            IsFallback = role.ProjectRole.IsFallback,
            PermissionList = role.ProjectRole.ProjectRolePermissions.Select(prp => new PermissionDTO
            {
                PermissionId = prp.ProjectPermission.Id,
                PermissionName = prp.ProjectPermission.Name
            }).ToList()
        };

        return Ok(roleDto);
    }

    [HttpPost("{projectId}/Roles")]
    public async Task<IActionResult> AddRoleToProject(int projectId, AddRoleRequest addRoleRequest)
    {
        var project = await dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId);

        if (project == null)
        {
            return BadRequest(new { message = "Project with given id not found" });
        }

        var roleExists = await dbContext.ProjectRoles.FirstOrDefaultAsync(r => r.Name == addRoleRequest.Name);

        if (roleExists != null)
        {
            return BadRequest(new { message = "Project role with given name already exists" });
        }

        var role = new ProjectRole
        {
            Name = addRoleRequest.Name
        };

        dbContext.ProjectRoles.Add(role);
        await dbContext.SaveChangesAsync();

        var ppr = new ProjectProjectRole
        {
            ProjectId = projectId,
            ProjectRoleId = role.Id
        };

        dbContext.ProjectProjectRoles.Add(ppr);
        await dbContext.SaveChangesAsync();

        var roleDto = new RoleDTO
        {
            Id = role.Id,
            Name = role.Name,
            IsDefault = role.IsDefault,
            IsFallback = role.IsFallback,
            PermissionList = new List<PermissionDTO>()
        };

        return Ok(roleDto);
    }
}