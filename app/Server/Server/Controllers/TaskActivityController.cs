using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.TaskActivity;
using Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Server.Services.Permission;
using Server.DataTransferObjects.Request.ProjectTask;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskActivityController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;
        private readonly IPermissionService _permissionService;

        public TaskActivityController(LogicTenacityDbContext dbContext, IPermissionService permissionService)
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

        [Authorize]
        [HttpPost] 
        public async Task<IActionResult> AddTaskActivity(AddTaskActivityRequest addTaskActivityRequest)
        {

            var idClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");
            
            if (idClaim == null)
            {
                return BadRequest(new { message = "Member id claim is missing in jwt token" });
            }

            var memberId = int.Parse(idClaim.Value);

            var member = await dbContext.Members.FindAsync(memberId);
            if (member == null)
            {
                return BadRequest(new { message = "Member not found" });
            }

            var projectTask = await dbContext.ProjectTasks.FirstOrDefaultAsync(pt => pt.TaskId == addTaskActivityRequest.TaskId);

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Add task activity");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var taskActivity = new TaskActivity
            {
                MemberId = member.Id,
                ProjectTaskId = addTaskActivityRequest.TaskId,
                ActivityDate = DateTime.Now,
                Description = addTaskActivityRequest.Description,
                TaskActivityTypeId = addTaskActivityRequest.TaskActivityTypeId
            };

            dbContext.TaskActivities.Add(taskActivity);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Task activity added successfully." });

        }

        [Authorize]
        [HttpDelete("{taskActivityId}")]
        public async Task<IActionResult> DeleteTaskActivity(int taskActivityId)
        {
            var taskActivity = await dbContext.TaskActivities
                  .Include(ta => ta.ProjectTask)
                      .ThenInclude(t => t.Project)
                  .FirstOrDefaultAsync(ta => ta.TaskActivityId == taskActivityId);

            var hasPermission = await _permissionService.HasProjectPermissionAsync(taskActivity.ProjectTask.ProjectId, "Remove task activity");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }


            if (taskActivity == null)
            {
                return NotFound(new {message = "Task activity not found"});
            }

         
            dbContext.TaskActivities.Remove(taskActivity);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Task activity deleted successfully." });

        }

        [Authorize]
        [HttpGet("{taskActivityId}")]
        public async Task<IActionResult> GetTaskActivityById(int taskActivityId)
        {
            var taskActivity = await dbContext.TaskActivities
                .Include(ta => ta.ProjectTask)
                    .ThenInclude(t => t.Project)
                .Include(ta => ta.Member)
                    .ThenInclude(t => t.Role)
                .Include(ta => ta.TaskActivityType)
                .FirstOrDefaultAsync(ta => ta.TaskActivityId == taskActivityId);

            if (taskActivity == null)
            {
                return NotFound(new {message = "Task activity not found"});
            }

            var taskActivityDTO = new TaskActivityDTO
            {
                TaskActivityId = taskActivity.TaskActivityId,
                WorkerId = taskActivity.MemberId,
                TaskId = taskActivity.ProjectTaskId,
                ProjectId = taskActivity.ProjectTask.ProjectId,
                DateModify = taskActivity.ActivityDate,
                Comment = taskActivity.Description,
                TaskActivityTypeId = taskActivity.TaskActivityTypeId,
                Name = taskActivity.Member.FirstName,
                Lastname = taskActivity.Member.LastName,
                Country = taskActivity.Member.Country,
                DateOfBirth = taskActivity.Member.DateOfBirth,
                Email = taskActivity.Member.Email,
                RoleName = taskActivity.Member.Role.RoleName
            };

            
            return Ok(taskActivityDTO);
        }

        [HttpGet("Task/{taskId}")]
        public async Task<IActionResult> GetTaskActivitiesByTaskId(int taskId)
        {
            var taskActivities = await dbContext.TaskActivities
                .Include(ta => ta.ProjectTask)
                    .ThenInclude(pt => pt.Project)
                .Include(ta => ta.Member)
                    .ThenInclude(ta => ta.Role)
                .Include(ta => ta.TaskActivityType)
                .Where(ta => ta.ProjectTaskId == taskId)
                .ToListAsync();

            if (taskActivities == null || !taskActivities.Any())
            {
                return NotFound(new { message = "Task activity not found" });
            }

            var taskActivityDTOs = taskActivities.Select(ta => new TaskActivityDTO
            {
                TaskActivityId = ta.TaskActivityId,
                WorkerId = ta.MemberId,
                TaskId = ta.ProjectTaskId,
                ProjectId = ta.ProjectTask.ProjectId,
                DateModify = ta.ActivityDate,
                Comment = ta.Description,
                TaskActivityTypeId = ta.TaskActivityTypeId,
                Name = ta.Member.FirstName,
                Lastname = ta.Member.LastName,
                Email = ta.Member.Email,
                Country = ta.Member.Country,
                DateOfBirth = ta.Member.DateOfBirth,
                RoleName = ta.Member.Role.RoleName
            }).ToList();

            return Ok(taskActivityDTOs);
        }

    }
}
