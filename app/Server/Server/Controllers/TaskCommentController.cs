using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Server.Services.Permission;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]

    public class TaskCommetController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;
        private readonly IPermissionService _permissionService;
        
        public TaskCommentController(LogicTenacityDbContext dbContext, IPermissionService permissionService)
        {
            this.dbContext = dbContext;
            _permissionService = permissionService;
        }
        
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllTaskActivities()
        {
            var taskActivities = await dbContext.TaskActivities
                .Include(ta => ta.ProjectTask)
                .ThenInclude(pt => pt.Project)
                .Include(ta => ta.TaskActivityType)
                .Include(ta => ta.Member)
                .ThenInclude(ta => ta.Role)
                .OrderByDescending(ta => ta.ActivityDate)
                .ToListAsync();

            var taskActivityDTOs = taskActivities.Select(ta => new TaskActivityDTO
            {
                TaskActivityId = ta.TaskActivityId,
                WorkerId = ta.MemberId,
                Name = ta.Member.FirstName,
                Lastname = ta.Member.FirstName,
                Country = ta.Member.Country,
                DateOfBirth = ta.Member.DateOfBirth,
                Email = ta.Member.Email,
                RoleName = ta.Member.Role.RoleName,
                TaskId = ta.ProjectTaskId,
                ProjectId = ta.ProjectTask.ProjectId,
                DateModify = ta.ActivityDate,
                Comment = ta.Description,
                TaskActivityTypeId = ta.TaskActivityTypeId
            }).ToList();

            return Ok(taskActivityDTOs);
        }
    }
}
