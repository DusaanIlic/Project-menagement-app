using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Evaluation;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Plugins;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request;
using Server.Models;
using Server.Services.Permission;
using TaskStatus = Server.Models.TaskStatus;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class ProjectController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;
        private readonly IPermissionService _permissionService;
        private readonly IEmailService _emailService;

        public ProjectController(LogicTenacityDbContext dbContext, IPermissionService permissionService, IEmailService emailService)
        {
            this.dbContext = dbContext;
            _permissionService = permissionService;
            _emailService = emailService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.TaskStatus)
                .Include(p => p.TeamLeader)
                .ThenInclude(ptl => ptl.Role)
                .Include(p => p.MemberProjects)
                .Include(p => p.Priority)
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
                    TaskStatus = t.TaskStatus.Name,
                    TaskStatusId = t.TaskStatusId

                }).ToList();

                MemberDTO teamLeaderDTO = null;

                if (p.TeamLeader != null)
                {

                    teamLeaderDTO = new MemberDTO
                    {
                        Id = p.TeamLeader.Id,
                        FirstName = p.TeamLeader.FirstName,
                        LastName = p.TeamLeader.LastName,
                        Email = p.TeamLeader.Email,
                        RoleId = p.TeamLeader.RoleId,
                        RoleName = p.TeamLeader.Role.RoleName
                    };
                }

                int numberOfMembers = dbContext.MemberProjects.Count(mp => mp.ProjectId == p.ProjectId && !mp.Member.IsDisabled);
                int numberOfTasks = dbContext.ProjectTasks.Count(mt => mt.ProjectId == p.ProjectId);
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
                        StartDate = p.StartDate,
                        NumberOfPeople = numberOfMembers,
                        NumberOfTasks = numberOfTasks,
                        ProjectPriority = p.Priority.Name,
                        ProjectPriorityId = p.ProjectPriorityId
                });
            }

            return Ok(projectDTOs);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddProjects(AddProjectRequest addProjectRequest)
        {
            var projectStatus = dbContext.ProjectStatuses.FirstOrDefault(ps => ps.Id == 1);
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var hasPermission = await _permissionService.HasGlobalPermissionAsync("Create project");
            
            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var teamLeader = await dbContext.Members
                                    .Include(m => m.Role)
                                    .FirstOrDefaultAsync(m => m.Id == userId);

            var priority = await dbContext.ProjectPriorities.FindAsync(addProjectRequest.PriorityId);
            
            if (teamLeader == null)
            {
                return BadRequest(new {message = "Member not found"});
            }

            var project = new Models.Project()
            {
                ProjectName = addProjectRequest.ProjectName,
                ProjectDescription = addProjectRequest.ProjectDescription,
                Deadline = addProjectRequest.Deadline,
                StartDate = DateTime.Now,
                ProjectStatus = projectStatus,
                TeamLeaderId = teamLeader.Id,
                ProjectPriorityId= priority.ProjectPriorityId
            };

            var firstThreeTaskStatuses = await dbContext.TaskStatuses.Where(ts => ts.IsDefault).ToListAsync();

            project.ProjectTaskStatuses = firstThreeTaskStatuses
                .Select(status => new ProjectTaskStatus { TaskStatus = status }).ToList();
            
            var defaultProjectRoles = await dbContext.ProjectRoles.Where(pr => pr.IsDefault).ToListAsync();

            project.ProjectProjectRoles = defaultProjectRoles
                .Select(projectRole => new ProjectProjectRole {ProjectRole = projectRole }).ToList();

            dbContext.Projects.Add(project);
            
            await dbContext.SaveChangesAsync();

            var projectTaskCategories = new ProjectTaskCategories
            {
                ProjectId = project.ProjectId,
                TaskCategoryId = 1
            };

            dbContext.ProjectTaskCategories.Add(projectTaskCategories);
            await dbContext.SaveChangesAsync();

            dbContext.MemberProjects.Add(new MemberProject { MemberId = userId, ProjectId = project.ProjectId, ProjectRoleId = 1 });
            
            await dbContext.SaveChangesAsync();

            var teamLeaderDTO = new MemberDTO
            {
                Id = teamLeader.Id,
                FirstName = teamLeader.FirstName,
                LastName = teamLeader.LastName,
                Email = teamLeader.Email,
                RoleId = teamLeader.RoleId,
                DateAdded = teamLeader.DateAdded,
                Country = teamLeader.Country,
                City = teamLeader.City,
                Status = teamLeader.Status,
                Github = teamLeader.Github,
                Linkedin = teamLeader.Linkedin,
                PhoneNumber = teamLeader.PhoneNumber,
                DateOfBirth = teamLeader.DateOfBirth,
                RoleName = teamLeader.Role.RoleName,
                IsDisabled = teamLeader.IsDisabled
            };

            int numberOfMembers = dbContext.MemberProjects.Count(mp => mp.ProjectId == project.ProjectId && !mp.Member.IsDisabled);
            int numberOfTasks = dbContext.ProjectTasks.Count(mt => mt.ProjectId == project.ProjectId);

            var projectDTO = new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                Deadline = project.Deadline,
                ProjectStatusId = project.ProjectStatus.Id,
                Status = projectStatus.Status,
                StartDate = project.StartDate,
                TeamLider = teamLeaderDTO,
                NumberOfPeople = numberOfMembers,
                NumberOfTasks = numberOfTasks,
                ProjectPriorityId = priority.ProjectPriorityId,
                ProjectPriority = priority.Name
            };

            return Ok(projectDTO);
        }

        [Authorize]
        [HttpGet("{projectId}")]
        public IActionResult GetProject(int projectId)
        {
       
            var project = dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.TaskStatus)
                .Include(p => p.TeamLeader)
                .ThenInclude(ptl => ptl.Role)
                .Include(p => p.MemberProjects)
                .Include (p => p.Priority)
                .SingleOrDefault(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound(new {message = "Project not found"}); 
            }

            var taskDTOs = project.ProjectTasks.Select(t => new ProjectTaskDTO
            {
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                TaskDescription = t.TaskDescription,
                Deadline = t.Deadline,
                ProjectId = t.ProjectId,
                TaskStatus = t.TaskStatus.Name,
                TaskStatusId = t.TaskStatusId
            }).ToList();

            int numberOfTasks = dbContext.ProjectTasks.Count(mt => mt.ProjectId == project.ProjectId);

            MemberDTO teamLeaderDTO = null;

            if (project.TeamLeader != null)
            {

                teamLeaderDTO = new MemberDTO
                {
                    Id = project.TeamLeader.Id,
                    FirstName = project.TeamLeader.FirstName,
                    LastName = project.TeamLeader.LastName,
                    Email = project.TeamLeader.Email,
                    RoleId = project.TeamLeader.RoleId,
                    RoleName = project.TeamLeader.Role.RoleName,
                    IsDisabled = project.TeamLeader.IsDisabled
                };
            }

            int numberOfMembers = dbContext.MemberProjects.Count(mp => mp.ProjectId == project.ProjectId && !mp.Member.IsDisabled);

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
                StartDate = project.StartDate,
                NumberOfPeople = numberOfMembers,
                NumberOfTasks = numberOfTasks,
                ProjectPriority = project.Priority.Name,
                ProjectPriorityId = project.ProjectPriorityId
            };

            return Ok(projectDTO);
        }

        [Authorize]
        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject(int projectId, UpdateProjectRequest updateProjectRequest)
        {
            if (!await _permissionService.HasProjectPermissionAsync(projectId, "Change project"))
            {
                return Forbid();
            }
            
            var project = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.TaskStatus)
                .Include(p => p.TeamLeader)
                .ThenInclude(ptl => ptl.Role)
                .Include(p => p.Priority)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound(new {message = "Project not found"});
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
                TaskStatus = t.TaskStatus.Name,
                TaskStatusId = t.TaskStatusId
            }).ToList();

            MemberDTO teamLeaderDTO = null;

            if (project.TeamLeader != null)
            {

                teamLeaderDTO = new MemberDTO
                {
                    Id = project.TeamLeader.Id,
                    FirstName = project.TeamLeader.FirstName,
                    LastName = project.TeamLeader.LastName,
                    Email = project.TeamLeader.Email,
                    RoleId = project.TeamLeader.RoleId,
                    RoleName = project.TeamLeader.Role.RoleName,
                    IsDisabled = project.TeamLeader.IsDisabled
                };
            }

            int numberOfMembers = dbContext.MemberProjects.Count(mp => mp.ProjectId == project.ProjectId && !mp.Member.IsDisabled);
            int numberOfTasks = dbContext.ProjectTasks.Count(mt => mt.ProjectId == project.ProjectId);

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
                StartDate = project.StartDate,
                NumberOfPeople = numberOfMembers,
                NumberOfTasks = numberOfTasks,
                ProjectPriority = project.Priority.Name,
                ProjectPriorityId = project.ProjectPriorityId
            };

            return Ok(projectDTO);
        }

        [Authorize]
        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectId, "Delete project");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var project = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks )
                   .ThenInclude(pts => pts.TaskStatus)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound(new {message = "Project not found."});
            }
         
            dbContext.Projects.Remove(project);

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Project deleted successfully." });

        }


        [Authorize]
        [HttpPut("{projectId}/status/{statusId}")]
        public async Task<IActionResult> UpdateProjectStatus(int projectId, int statusId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }


            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectId, "Change project status");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var project = await dbContext.Projects
                .Include(p => p.ProjectStatus)
                .Include(p => p.ProjectTasks)
                .ThenInclude(pts => pts.TaskStatus)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
                return NotFound(new { message = "Project not found" });

            var status = await dbContext.ProjectStatuses.FindAsync(statusId);
            if (status == null)
                return NotFound(new { message = "Status not found" });

            if(statusId == 3 && project.StartDate == DateTime.MinValue)
            {
                project.StartDate = DateTime.Now;
            }

            if(statusId == 2)
            {
                project.DateFinished = DateTime.Now;
            }

            project.ProjectStatus = status;
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Project status updated successfully." });

        }

        [Authorize]
        [HttpGet("{projectId}/Tasks")]
        public async Task<IActionResult> GetProjectTasks(int projectId)
        {
            var project = await dbContext.Projects.FindAsync(projectId);

            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            var tasks = await dbContext.ProjectTasks
                                        .Where(t => t.ProjectId == projectId)
                                        .Include(pt => pt.TaskStatus)
                                        .ToListAsync();

            var tasksDTOs = tasks.Select(t => new ProjectTaskDTO
            {
                Deadline = t.Deadline,
                ProjectId = t.ProjectId,
                TaskDescription = t.TaskDescription,
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                TaskStatus = t.TaskStatus.Name,
                TaskStatusId = t.TaskStatusId
            }).ToList();

            return Ok(tasksDTOs);
        }

        [Authorize]
        [HttpPost("{projectId}/teamleader/{memberId}")]
        public async Task<IActionResult> AddTeamLeaderToProject(int projectId, int memberId)
        {
            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectId, "Add member to project");

            if (!hasPermission)
            {
                return Forbid();
            }
            
            var project = await dbContext.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            var person = await dbContext.Members.FindAsync(memberId);
            if (person == null)
            {
                return NotFound(new { message = "Member not found" });
            }

            project.TeamLeaderId = memberId;
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Team leader added successfully." });

        }

        [Authorize]
        [HttpPost("{projectId}/members")]
        public async Task<IActionResult> AddMembersToProject(int projectId, List<int> memberIds)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }
            
            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectId, "Add member to project");
            
            
            Console.WriteLine("stigne dovde");
            
            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var project = await dbContext.Projects.FindAsync(projectId);
            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }
            
            var members = await dbContext.Members.Where(m => memberIds.Contains(m.Id) && !m.IsDisabled).ToListAsync();
            
            if (members == null || members.Count != memberIds.Count)
            {
                return NotFound(new { message = "One or more members not found" });
            }

            foreach (var memberId in memberIds)
            {  
                if (project.TeamLeaderId == memberId)
                {
                    return BadRequest(new { message = "Member is already a team leader of the project" });
                }

                var existingMemberProject = await dbContext.MemberProjects.FirstOrDefaultAsync(mp => mp.ProjectId == projectId && mp.MemberId == memberId);
                if (existingMemberProject != null)
                {
                    return BadRequest(new { message = "Member already exists in the project" });
                }

                var defaultRole = await dbContext.ProjectRoles.FirstOrDefaultAsync(pr => pr.IsFallback);
                
                dbContext.MemberProjects.Add(new MemberProject { MemberId = memberId, ProjectId = projectId, ProjectRoleId = defaultRole.Id });

                var member = await dbContext.Members.FirstOrDefaultAsync(m => m.Id == memberId);

                var request = new EmailDTO
                {
                    To = member.Email,
                    Subject = "New Task Assignment",
                    Body = $@"
                        <p>Hello {member.FirstName} {member.LastName},</p>
                        
                        <p>You have been assigned to a new project.</p>
                        
                        <p>Below are your project details:</p>
                        
                        <ul>
                            <li><strong>Name:</strong> {project.ProjectName}</li>
                            <li><strong>Deadline:</strong> {project.Deadline}</li>
                            <li><strong>Status:</strong> {project.ProjectStatus}</li>
                            <li><strong>Description:</strong> {project.ProjectDescription}</li>
                        </ul>"
                };

                var result = _emailService.SendEmail(request);
            }

            await dbContext.SaveChangesAsync();

            return Ok(new {Message = "Members added to project successfully"});
        }

        [Authorize]
        [HttpDelete("{projectId}/members/{memberId}")]
        public async Task<IActionResult> RemoveMemberFromProject(int projectId, int memberId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectId, "Remove member from project");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var project = await dbContext.Projects
                .Include(p => p.MemberProjects)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            var memberProject = project.MemberProjects.FirstOrDefault(mp => mp.MemberId == memberId);
            if (memberProject == null)
            {
                return NotFound(new { message = "Member not found on project" });
            }

            dbContext.MemberProjects.Remove(memberProject);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Member removed from project successfully." });

        }

        [Authorize]
        [HttpGet("{projectId}/members")]
        public async Task<IActionResult> GetAllMembersOnProject(int projectId)
        {
            var project = dbContext.Projects.FindAsync(projectId);

            if(project == null)
            {
                return BadRequest(new { message = "Project not found." });
            }

            var members = await dbContext.Members
                              .Where(m => dbContext.MemberProjects
                                                 .Any(mp => mp.ProjectId == projectId && mp.MemberId == m.Id) && !m.IsDisabled)
                              .Include(m => m.Role)
                              .ToListAsync();

            var membersDTO = members.Select(member => new MemberDTO
            {
                Id = member.Id,
                FirstName = member.FirstName,
                LastName = member.LastName,
                RoleId = member.RoleId,
                RoleName = member.Role.RoleName,
                Email = member.Email,
                Status = member.Status
            });

            return Ok(membersDTO);

        }

        [HttpGet("project/{projectId}/categories")]
        public async Task<IActionResult> GetCategoriesForProject(int projectId)
        {
            var project = await dbContext.Projects
                .Include(p => p.ProjectTasks)
                    .ThenInclude(ptc => ptc.TaskCategory)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                return NotFound(new { message = "Project not found" });
            }

            var categories = project.ProjectTasks
                .Select(ptc => new TaskAndCategoryDTO
                {
                    ProjectTaskId = ptc.TaskId,
                    TaskCategoryId = ptc.TaskCategoryId,
                    TaskCategoryName = ptc.TaskCategory.CategoryName
                })
                .ToList();

            return Ok(categories);
        }

        [Authorize]
        [HttpPost("projects/{projectId}/priority/{priorityId}")]
        public async Task<IActionResult> UpdateProjectPriority(int projectId, int priorityId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectId, "Remove member from project");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }


            var project = await dbContext.Projects.FindAsync(projectId);
            if(projectId == null)
            {
                return BadRequest(new { message = "Project with this id does not exists." });
            }

            var priority = await dbContext.ProjectPriorities.FindAsync(priorityId);

            if(priority == null)
            {
                return BadRequest(new { message = "Project priority with this id does not exists." });
            }

            project.Priority = priority;
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Project priority changed successfully." });
        }

        [Authorize]
        [HttpGet("projects/priority/{priorityId}")]
        public async Task<IActionResult> GetAllProjectsByProjectPriority(int priorityId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");
            
            if (userIdClaim == null)
            {
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var priority = await dbContext.ProjectPriorities.FindAsync(priorityId);
            if (priority == null)
            {
                return BadRequest(new { message = "Project priority not found" });
            }

            var projects = await dbContext.Projects.Where(p => p.ProjectPriorityId == priorityId).Include(p=>p.ProjectStatus).ToListAsync();

            var projectsDTOs = projects.Select(p => new ProjectDTO
            {
                ProjectId = p.ProjectId,
                ProjectName = p.ProjectName,
                ProjectDescription = p.ProjectDescription,
                Deadline = p.Deadline,
                ProjectStatusId = p.ProjectStatusId,
                Status = p.ProjectStatus.Status,
                StartDate = p.StartDate,
                ProjectPriority = priority.Name, 
                ProjectPriorityId = p.ProjectPriorityId
            });

            return Ok(projectsDTOs);
        }

        [HttpGet("{projectId}/Latest")]
        public async Task<IActionResult> GetLatestTaskActivitiesForProject(int projectId)
        {
            var taskActivities = await dbContext.TaskActivities
                .Include(ta => ta.ProjectTask)
                    .ThenInclude(pt => pt.Project)
                .Include(ta => ta.Member)
                    .ThenInclude(ta => ta.Role)
                .Include(ta => ta.TaskActivityType)
                .Where(ta => ta.ProjectTask.ProjectId == projectId)
                .OrderByDescending(ta => ta.ActivityDate)
                .Take(5)
                .ToListAsync();

            if (taskActivities == null || !taskActivities.Any())
            {
                return NotFound(new { message = "No task activities found for the project" });
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
