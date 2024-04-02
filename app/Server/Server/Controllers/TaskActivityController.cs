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

        [HttpGet]
        public async Task<IActionResult> GetAllTaskActivities()
        {
            var taskActivities = await dbContext.TaskActivities
                .Include(ta => ta.ProjectTask)
                    .ThenInclude(pt => pt.Project)
                .Include(ta => ta.TaskActivityType)
                .Include(ta => ta.Member)
                .ToListAsync();

            var taskActivityDTOs = taskActivities.Select(ta => new TaskActivityDTO
            {
                TaskActivityId = ta.TaskActivityId,
                WorkerId = ta.MemberId,
                TaskId = ta.ProjectTaskId,
                ProjectId = ta.ProjectTask.ProjectId,
                DateModify = ta.ActivityDate,
                Comment = ta.Description,
                TaskActivityTypeId = ta.TaskActivityTypeId
            }).ToList();

            return Ok(taskActivityDTOs);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddTaskActivity(AddTaskActivityRequest addTaskActivityRequest)
        {

            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(token) || !token.StartsWith("Bearer "))
            {
                return BadRequest("Authorization token is missing or invalid.");
            }

            var jwtToken = token.Split(" ")[1];

            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadJwtToken(jwtToken);


            string memberEmail = decodedToken.Claims.First(claim => claim.Type == "email").Value;
            Console.WriteLine(memberEmail);

          
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
