using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public ProjectController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await dbContext.Projects.ToListAsync();
            var projectDTOs = projects.Select(p => new ProjectDTO
            {
                ProjectId = p.ProjectId,
                ProjectName = p.ProjectName,
                ProjectDescription = p.ProjectDescription,
                DeadLine = p.DeadLine,
                ProjectStatus = p.ProjectStatus.Status,
                ProjectStatusId = p.ProjectStatusId
            }).ToList();
            return Ok(projectDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddProjects(AddProjectRequest addProjectRequest)
        {
            var project = new Project()
            {
                ProjectName = addProjectRequest.ProjectName,
                ProjectDescription = addProjectRequest.ProjectDescription,
                DeadLine = addProjectRequest.DeadLine,
                ProjectStatusId = 1,
                ProjectStatus = dbContext.ProjectStatuses
                                     .Where(ps => ps.Id == 1)
                                     .FirstOrDefault()
        };

            dbContext.Projects.Add(project);
            await dbContext.SaveChangesAsync();

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                DeadLine = project.DeadLine,
                ProjectStatus = project.ProjectStatus.Status,
                ProjectStatusId = project.ProjectStatusId
            };

            return Ok(projectDTO);
        }

        [HttpGet("{projectId}")]
        public IActionResult GetProject(int projectId)
        {
       
            var project = dbContext.Projects.SingleOrDefault(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound(); 
            }

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                DeadLine = project.DeadLine,
                ProjectStatus = project.ProjectStatus.Status,
                ProjectStatusId = project.ProjectStatusId
            };

            return Ok(projectDTO);
        }

        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject(int projectId, UpdateProjectRequest updateProjectRequest)
        {

            var project = await dbContext.Projects.FindAsync(projectId);

            if (project == null)
            {
                return NotFound();
            }

            project.ProjectName = updateProjectRequest.ProjectName;
            project.ProjectDescription = updateProjectRequest.ProjectDescription;
            project.DeadLine = updateProjectRequest.DeadLine;
            
            await dbContext.SaveChangesAsync();

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                DeadLine = project.DeadLine,
                ProjectStatus = project.ProjectStatus.Status,
                ProjectStatusId = project.ProjectStatusId
            };

            return Ok(projectDTO);
        }

        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var project = await dbContext.Projects.FindAsync(projectId);

            
            if (project == null)
            {
                return NotFound();
            }
         
            dbContext.Projects.Remove(project);

            await dbContext.SaveChangesAsync();

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                DeadLine = project.DeadLine,
                ProjectStatus = project.ProjectStatus.Status,
                ProjectStatusId = project.ProjectStatusId
            };

            return Ok(projectDTO);
        }
    }
}
