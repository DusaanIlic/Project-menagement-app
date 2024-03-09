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
            var projects = await dbContext.Projects.Include(p => p.ProjectStatus).ToListAsync();
            var projectDTOs = new List<ProjectDTO>();

            foreach (var p in projects)
            {
                
                    projectDTOs.Add(new ProjectDTO
                    {
                        ProjectId = p.ProjectId,
                        ProjectName = p.ProjectName,
                        ProjectDescription = p.ProjectDescription,
                        DeadLine = p.DeadLine,
                        ProjectStatusId = p.ProjectStatusId,
                        Status = p.ProjectStatus.Status
                    });
                
            }

            return Ok(projectDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddProjects(AddProjectRequest addProjectRequest)
        {
            var projectStatus = dbContext.ProjectStatuses.FirstOrDefault(ps => ps.Id == 1);

            var project = new Project()
            {
                ProjectName = addProjectRequest.ProjectName,
                ProjectDescription = addProjectRequest.ProjectDescription,
                DeadLine = addProjectRequest.DeadLine,
                ProjectStatus = projectStatus,
        };

            dbContext.Projects.Add(project);
            await dbContext.SaveChangesAsync();

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                DeadLine = project.DeadLine,
                ProjectStatusId = project.ProjectStatus.Id,
                Status = projectStatus.Status
            };

            return Ok(projectDTO);
        }

        [HttpGet("{projectId}")]
        public IActionResult GetProject(int projectId)
        {
       
            var project = dbContext.Projects.Include(p => p.ProjectStatus).SingleOrDefault(p => p.ProjectId == projectId);

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
                ProjectStatusId = project.ProjectStatusId,
                Status = project.ProjectStatus.Status
            };

            return Ok(projectDTO);
        }

        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject(int projectId, UpdateProjectRequest updateProjectRequest)
        {

            var project = await dbContext.Projects.Include(p => p.ProjectStatus).FirstOrDefaultAsync(p => p.ProjectId == projectId);

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
                ProjectStatusId = project.ProjectStatusId,
                Status = project.ProjectStatus.Status
            };

            return Ok(projectDTO);
        }

        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var project = await dbContext.Projects.Include(p => p.ProjectStatus).FirstOrDefaultAsync(p => p.ProjectId == projectId);

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
                ProjectStatusId = project.ProjectStatusId,
                Status =  project.ProjectStatus.Status
            };

            return Ok(projectDTO);
        }

        [HttpPut("{projectId}/status/{statusId}")]
        public async Task<IActionResult> UpdateProjectStatus(int projectId, int statusId)
        {
            var project = await dbContext.Projects.Include(p => p.ProjectStatus).FirstOrDefaultAsync(p => p.ProjectId == projectId);
            if (project == null)
                return NotFound("Project not found");

            var status = await dbContext.ProjectStatuses.FindAsync(statusId);
            if (status == null)
                return NotFound("Status not found");

            project.ProjectStatus = status;
            await dbContext.SaveChangesAsync();

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                DeadLine = project.DeadLine,
                ProjectStatusId = project.ProjectStatus.Id,
                Status = project.ProjectStatus.Status
            };

            return Ok(projectDTO);
        }

    }
}
