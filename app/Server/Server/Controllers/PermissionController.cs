using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.Permission;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public PermissionController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetPermissions()
        {
            var permissions = await dbContext.Permissions.ToListAsync();
            var permissionDTOs = permissions.Select(p => new PermissionDTO
            {
                PermissionId = p.PermissionId,
                PermissionName = p.PermissionName
            }).ToList();

            return Ok(permissionDTOs);
        }

        [HttpGet("{permissionId}")]
        public async Task<IActionResult> GetPermissionById(int permissionId)
        {
            var permission = await dbContext.Permissions.FindAsync(permissionId);

            if (permission == null)
            {
                return NotFound("Permission with this id does not exist");
            }

            var permissionDTO = new PermissionDTO
            {
                PermissionId = permission.PermissionId,
                PermissionName = permission.PermissionName
            };

            return Ok(permissionDTO);
        }

        [HttpPost]
        public async Task<IActionResult> AddPermission(AddPermissionRequest addPermissionRequest)
        {
            var permission = new Permission
            {
                PermissionName = addPermissionRequest.Name
            };

            dbContext.Permissions.Add(permission);
            await dbContext.SaveChangesAsync();

            var permissionDTO = new PermissionDTO
            {
                PermissionId = permission.PermissionId,
                PermissionName = permission.PermissionName
            };

            return Ok(permissionDTO);
        }

        [HttpDelete("{permissionId}")]
        public async Task<IActionResult> RemovePermission(int permissionId)
        {
            var permission = await dbContext.Permissions.FindAsync(permissionId);
            if (permission == null)
            {
                return NotFound("Permission with this id does not exist");
            }

            dbContext.Permissions.Remove(permission);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
