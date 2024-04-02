using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.TaskActivity;
using Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskActivityController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public TaskActivityController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("{taskActivityId}")]
        public async Task<IActionResult> GetTaskActivity(int taskActivityId)
        {
            var taskActivity = await dbContext.TaskActivities
                .Include(ta => ta.ProjectTask)
                    .ThenInclude(pt => pt.Project)
                .Include(ta => ta.TaskActivityType)
                .Include(ta => ta.Member)
                .FirstOrDefaultAsync(ta => ta.TaskActivityId == taskActivityId);

            if (taskActivity == null)
            {
                return NotFound("Task activity not found.");
            }

            var taskActivityDTO = new TaskActivityDTO
            {
                TaskActivityId = taskActivity.TaskActivityId,
                WorkerId = taskActivity.MemberId, 
                TaskId = taskActivity.ProjectTaskId, 
                ProjectId = taskActivity.ProjectTask.ProjectId,
                DateModify = taskActivity.ActivityDate,
                Comment = taskActivity.Description,
                TaskActivityTypeId = taskActivity.TaskActivityTypeId
            };

            return Ok(taskActivityDTO);
        }

        [HttpPost]
        public async Task<IActionResult> AddTaskActivity(AddTaskActivityRequest addTaskActivityRequest)
        {
            
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadJwtToken(token);

         
            string memberEmail = decodedToken.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;

           
            var member = await dbContext.Members.FirstOrDefaultAsync(m => m.Email == memberEmail);

            if (member == null)
            {
                return NotFound("Member not found.");
            }


            var taskActivity = new TaskActivity
            {
                MemberId = member.Id,
                ProjectTaskId = addTaskActivityRequest.TaskId,
                ActivityDate = DateTime.UtcNow,
                Description = addTaskActivityRequest.Description,
                TaskActivityTypeId = addTaskActivityRequest.TaskActivityTypeId
            };

            dbContext.TaskActivities.Add(taskActivity);
            await dbContext.SaveChangesAsync();

            return Ok("Task activity added successfully.");
        }

        [HttpDelete("{taskActivityId}")]
        public async Task<IActionResult> DeleteTaskActivity(int taskActivityId)
        {
            var taskActivity = await dbContext.TaskActivities.FindAsync(taskActivityId);
          
            if (taskActivity == null)
            {
                return NotFound();
            }

         
            dbContext.TaskActivities.Remove(taskActivity);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{taskActivityId}")]
        public async Task<IActionResult> GetTaskActivityById(int taskActivityId)
        {
            var taskActivity = await dbContext.TaskActivities
                .Include(ta => ta.ProjectTask)
                    .ThenInclude(t => t.Project)
                .Include(ta => ta.Member)
                .Include(ta => ta.TaskActivityType)
                .FirstOrDefaultAsync(ta => ta.TaskActivityId == taskActivityId);

            if (taskActivity == null)
            {
                return NotFound();
            }
           
            var taskActivityDTO = new TaskActivityDTO
            {
                TaskActivityId = taskActivity.TaskActivityId,
                WorkerId = taskActivity.MemberId,
                TaskId = taskActivity.ProjectTaskId,
                ProjectId = taskActivity.ProjectTask.ProjectId,
                DateModify = taskActivity.ActivityDate,
                Comment = taskActivity.Description,
                TaskActivityTypeId = taskActivity.TaskActivityTypeId
            };

            
            return Ok(taskActivityDTO);
        }

    }
}
