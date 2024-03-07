using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.DataTransferObjects.Request;
using Server.DataTransferObjects;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.DataTransferObjects.Request.ProjectStatus;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectStatusController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public ProjectStatusController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjectStatuses()
        {
            var projectStatuses = await dbContext.ProjectStatuses.ToListAsync();
            var projectStatusDTOs = projectStatuses.Select(p => new ProjectStatusDTO
            {
                ProjectStatusId = p.Id,
                ProjectStatus = p.Status
            }).ToList();
            return Ok(projectStatusDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddProjectStatus(AddProjectStatusRequest addProjectStatusRequest)
        {
            var projectStatus = new ProjectStatus()
            {
               Status = addProjectStatusRequest.StatusName
            };

            dbContext.ProjectStatuses.Add(projectStatus);
            await dbContext.SaveChangesAsync();

            var projectStatusDTO = new ProjectStatusDTO
            {
                ProjectStatusId = projectStatus.Id,
                ProjectStatus = projectStatus.Status
            };

            return Ok(projectStatusDTO);
        }

        [HttpGet("{projectStatusId}")]
        public IActionResult GetProject(int projectStatusId)
        {

            var projectStatus = dbContext.ProjectStatuses.SingleOrDefault(p => p.Id == projectStatusId);

            if (projectStatus == null)
            {
                return NotFound();
            }

            var projectStatusDTO = new ProjectStatusDTO
            {
                ProjectStatusId = projectStatus.Id,
                ProjectStatus = projectStatus.Status
            };

            return Ok(projectStatusDTO);
        }

        [HttpDelete("{projectStatusId}")]
        public async Task<IActionResult> DeleteProjectStatus(int projectStatusId)
        {
            var projectStatus = await dbContext.ProjectStatuses.FindAsync(projectStatusId);


            if (projectStatus == null)
            {
                return NotFound();
            }

            dbContext.ProjectStatuses.Remove(projectStatus);

            await dbContext.SaveChangesAsync();

            var projectStatusDTO = new ProjectStatusDTO
            {
                ProjectStatusId = projectStatus.Id,
                ProjectStatus = projectStatus.Status
            };

            return Ok(projectStatusDTO);
        }

    }
}
