using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.Role;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public RoleController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await dbContext.Roles.ToListAsync();
            var roleDTOs = roles.Select(r => new RoleDTO
            {
                Id = r.RoleId,
                Name = r.RoleName
            }).ToList();

            return Ok(roleDTOs);
        }

        [HttpGet("{roleId}")]
        public async Task<IActionResult> GetRoleById(int roleId)
        {
            var role = await dbContext.Roles.FindAsync(roleId);

            if (role == null)
            {
                return NotFound("Role with this id does not exist");
            }

            var roleDTO = new RoleDTO
            {
                Id = role.RoleId,
                Name = role.RoleName
            };

            return Ok(roleDTO);
        }

        [HttpPost]
        public async Task<IActionResult> AddRole(AddRoleRequest addRoleRequest)
        {
            var role = new Role
            {
                RoleName = addRoleRequest.Name
            };

            dbContext.Roles.Add(role);
            await dbContext.SaveChangesAsync();

            var roleDTO = new RoleDTO
            {
                Id = role.RoleId,
                Name = role.RoleName
            };

            return Ok(roleDTO);
        }

        [HttpDelete("{roleId}")]
        public async Task<IActionResult> RemoveRole(int roleId)
        {
            var role = await dbContext.Roles.FindAsync(roleId);
            if (role == null)
            {
                return NotFound("Role with this id does not exist");
            }

            if(role.RoleId == 1 || role.RoleId == 2 || role.RoleId == 3)
            {
                return BadRequest("Cannot delete this role.");
            }

            dbContext.Roles.Remove(role);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("permissions/{roleId}")]
        public async Task<IActionResult> GetPermissionsByRoleId(int roleId)
        {
            var rolePermissions = await dbContext.RolePermissions
                                                .Where(rp => rp.RoleId == roleId)
                                                .Select(rp => rp.Permission)
                                                .ToListAsync();

            if (rolePermissions == null || rolePermissions.Count == 0)
            {
                return NotFound("Permissions for this role not found.");
            }

            var permissionDTOs = rolePermissions.Select(p => new PermissionDTO
            {
                PermissionId = p.PermissionId,
                PermissionName = p.PermissionName
            }).ToList();

            return Ok(permissionDTOs);
        }

        [HttpDelete("{roleId}/permissions/{permissionId}")]
        public async Task<IActionResult> RemovePermissionFromRole(int roleId, int permissionId)
        {
            var rolePermission = await dbContext.RolePermissions
                                              .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

            if (rolePermission == null)
            {
                return NotFound("Role permission not found.");
            }

            dbContext.RolePermissions.Remove(rolePermission);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
