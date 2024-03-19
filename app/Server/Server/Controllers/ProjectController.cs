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
            var projects = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.ProjectTaskStatus)
                .Include(p => p.TeamLeader)
                .ToListAsync();
            var projectDTOs = new List<ProjectDTO>();

            foreach (var p in projects)
            {
                var taskDTOs = p.ProjectTasks.Select(t => new ProjectTaskDTO
                {
                    TaskId = t.TaskId,
                    TaskName = t.TaskName,
                    TaskDescription = t.TaskDescription,
                    Deadline = t.Deadline,
                    ProjectId = p.ProjectId,
                    TaskStatus = t.ProjectTaskStatus.Name,
                    TaskStatusId = t.ProjectTaskStatusId

                }).ToList();

                MemberDTO teamLeaderDTO = null;

                if (p.TeamLeader != null)
                {

                    teamLeaderDTO = new MemberDTO
                    {
                        Id = p.TeamLeader.Id,
                        FullName = p.TeamLeader.FullName,
                        Email = p.TeamLeader.Email,
                        Role = p.TeamLeader.Role
                    };
                }

                projectDTOs.Add(new ProjectDTO
                    {
                        ProjectId = p.ProjectId,
                        ProjectName = p.ProjectName,
                        ProjectDescription = p.ProjectDescription,
                        Deadline = p.Deadline,
                        ProjectStatusId = p.ProjectStatusId,
                        Status = p.ProjectStatus.Status,
                        ProjectTasks = taskDTOs,
                        TeamLider = teamLeaderDTO,
                        StartDate = p.StartDate
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
                Deadline = addProjectRequest.Deadline,
                ProjectStatus = projectStatus
            };

            dbContext.Projects.Add(project);
            await dbContext.SaveChangesAsync();

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                Deadline = project.Deadline,
                ProjectStatusId = project.ProjectStatus.Id,
                Status = projectStatus.Status,
                StartDate = project.StartDate
            };

            return Ok(projectDTO);
        }

        [HttpGet("{projectId}")]
        public IActionResult GetProject(int projectId)
        {
       
            var project = dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.ProjectTaskStatus)
                .Include(p => p.TeamLeader)
                .SingleOrDefault(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound(); 
            }

            var taskDTOs = project.ProjectTasks.Select(t => new ProjectTaskDTO
            {
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                TaskDescription = t.TaskDescription,
                Deadline = t.Deadline,
                ProjectId = t.ProjectId,
                TaskStatus = t.ProjectTaskStatus.Name,
                TaskStatusId = t.ProjectTaskStatusId
            }).ToList();

            MemberDTO teamLeaderDTO = null;

            if (project.TeamLeader != null)
            {

                teamLeaderDTO = new MemberDTO
                {
                    Id = project.TeamLeader.Id,
                    FullName = project.TeamLeader.FullName,
                    Email = project.TeamLeader.Email,
                    Role = project.TeamLeader.Role
                };
            }
               

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                Deadline = project.Deadline,
                ProjectStatusId = project.ProjectStatusId,
                Status = project.ProjectStatus.Status,
                ProjectTasks = taskDTOs,
                TeamLider = teamLeaderDTO,
                StartDate = project.StartDate
            };

            return Ok(projectDTO);
        }

        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject(int projectId, UpdateProjectRequest updateProjectRequest)
        {

            var project = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.ProjectTaskStatus)
                .Include(p => p.TeamLeader)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound();
            }

            project.ProjectName = updateProjectRequest.ProjectName;
            project.ProjectDescription = updateProjectRequest.ProjectDescription;
            project.Deadline = updateProjectRequest.Deadline;
            
            await dbContext.SaveChangesAsync();

            var taskDTOs = project.ProjectTasks.Select(t => new ProjectTaskDTO
            {
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                TaskDescription = t.TaskDescription,
                Deadline = t.Deadline,
                ProjectId = t.ProjectId,
                TaskStatus = t.ProjectTaskStatus.Name,
                TaskStatusId = t.ProjectTaskStatusId
            }).ToList();

            MemberDTO teamLeaderDTO = null;

            if (project.TeamLeader != null)
            {

                teamLeaderDTO = new MemberDTO
                {
                    Id = project.TeamLeader.Id,
                    FullName = project.TeamLeader.FullName,
                    Email = project.TeamLeader.Email,
                    Role = project.TeamLeader.Role
                };
            }

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                Deadline = project.Deadline,
                ProjectStatusId = project.ProjectStatusId,
                Status = project.ProjectStatus.Status,
                ProjectTasks = taskDTOs,
                TeamLider = teamLeaderDTO,
                StartDate = project.StartDate
            };

            return Ok(projectDTO);
        }

        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var project = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks )
                   .ThenInclude(pts => pts.ProjectTaskStatus)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound();
            }
         
            dbContext.Projects.Remove(project);

            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{projectId}/status/{statusId}")]
        public async Task<IActionResult> UpdateProjectStatus(int projectId, int statusId)
        {
            var project = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.ProjectTaskStatus)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
                return NotFound("Project not found");

            var status = await dbContext.ProjectStatuses.FindAsync(statusId);
            if (status == null)
                return NotFound("Status not found");

            if(statusId == 2 && project.StartDate == DateTime.MinValue)
            {
                project.StartDate = DateTime.UtcNow;
            }

            project.ProjectStatus = status;
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{projectId}/Tasks")]
        public async Task<IActionResult> GetProjectTasks(int projectId)
        {
            var project = await dbContext.Projects.FindAsync(projectId);

            if (project == null)
            {
                return NotFound("Project not found");
            }

            var tasks = await dbContext.ProjectTasks
                                        .Where(t => t.ProjectId == projectId)
                                        .Include(pt => pt.ProjectTaskStatus)
                                        .ToListAsync();

            var tasksDTOs = tasks.Select(t => new ProjectTaskDTO
            {
                Deadline = t.Deadline,
                ProjectId = t.ProjectId,
                TaskDescription = t.TaskDescription,
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                TaskStatus = t.ProjectTaskStatus.Name,
                TaskStatusId = t.ProjectTaskStatusId
            }).ToList();

            return Ok(tasksDTOs);
        }

    }
}
