using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskPriorityController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public TaskPriorityController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetTaskPriority()
        {
            var taskPriority = await dbContext.TaskPriority.ToListAsync();
            var taskPriorityDTO = taskPriority.Select(p => new TaskPriorityDTO
            {
                TaskPriorityId = p.TaskPriorityId,
                Name = p.Name
            }).ToList();
            return Ok(taskPriorityDTO);
        }

        [HttpGet("{taskPriorityId}")]
        public IActionResult GetTaskPriorityName(int taskPriorityId)
        {

            var taskPriority= dbContext.TaskPriority.SingleOrDefault(p => p.TaskPriorityId == taskPriorityId);

            if ( taskPriority == null)
            {
                return NotFound();
            }

            var taskPriorityDTO = new TaskPriorityDTO
            {
                TaskPriorityId = taskPriority.TaskPriorityId,
                Name = taskPriority.Name
            };
            return Ok(taskPriorityDTO);
        }

    }
}
