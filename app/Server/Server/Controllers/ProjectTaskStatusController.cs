using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.ProjectTaskStatus;
using Server.Models;
using TaskStatus = Server.Models.TaskStatus;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTaskStatusController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public ProjectTaskStatusController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjectTaskStatuses()
        {
            var projectTaskStatuses = await dbContext.TaskStatuses.ToListAsync();
            var projectTaskStatusDTOs = projectTaskStatuses.Select(p => new ProjectTaskStatusDTO
            {
                ProjectTaskStatusId = p.Id,
                ProjectTaskStatus = p.Name
            }).ToList();
            return Ok(projectTaskStatusDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddProjectTaskStatus(AddProjectTaskStatusRequest addProjectTaskStatusRequest)
        {
            var projectTaskStatus = new TaskStatus()
            {
                Name = addProjectTaskStatusRequest.Name
            };

            dbContext.TaskStatuses.Add(projectTaskStatus);
            await dbContext.SaveChangesAsync();

            var projectTaskStatusDTO = new ProjectTaskStatusDTO
            {
                ProjectTaskStatusId = projectTaskStatus.Id,
                ProjectTaskStatus = projectTaskStatus.Name
            };

            return Ok(projectTaskStatusDTO);
        }

        [HttpGet("{projectTaskStatusId}")]
        public IActionResult GetProjectTaskStatus(int projectTaskStatusId)
        {

            var projectTaskStatus = dbContext.TaskStatuses.SingleOrDefault(p => p.Id == projectTaskStatusId);

            if (projectTaskStatus == null)
            {
                return NotFound();
            }

            var projectTaskStatusDTO = new ProjectTaskStatusDTO
            {
                ProjectTaskStatusId = projectTaskStatus.Id,
                ProjectTaskStatus = projectTaskStatus.Name
            };

            return Ok(projectTaskStatusDTO);
        }

        [HttpDelete("{projectTaskStatusId}")]
        public async Task<IActionResult> DeleteProjectTaskStatus(int projectTaskStatusId)
        {
            var projectTaskStatus = await dbContext.TaskStatuses.FindAsync(projectTaskStatusId);


            if (projectTaskStatus == null)
            {
                return NotFound();
            }

            dbContext.TaskStatuses.Remove(projectTaskStatus);

            await dbContext.SaveChangesAsync();

            var projectTaskStatusDTO = new ProjectTaskStatusDTO
            {
                ProjectTaskStatusId = projectTaskStatus.Id,
                ProjectTaskStatus = projectTaskStatus.Name
            };

            return Ok(projectTaskStatusDTO);
        }
    }
}
