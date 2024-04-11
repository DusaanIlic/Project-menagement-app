using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Evaluation;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request;
using Server.DataTransferObjects.Request.ProjectTask;
using Server.Models;
using Server.Services.RolePermission;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;
        private readonly IRolePermissionService rolePermissionService;
        private readonly IEmailService _emailService;

        public TaskController(LogicTenacityDbContext dbContext, IRolePermissionService rolePermissionService, IEmailService emailService)
        {
            this.dbContext = dbContext;
            this.rolePermissionService = rolePermissionService;
            _emailService = emailService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProjectTasks()
        {
            var tasks = await dbContext.ProjectTasks
                .Include(p => p.Project)
                .Include(ts => ts.TaskStatus)
                .Include(p => p.Members)
                         .ThenInclude(p => p.Member)
                         .ThenInclude(p => p.Role)
                .Include(tp => tp.TaskPriority)
                .Include(tc => tc.TaskCategory)
                .ToListAsync();

            var tasksDTOs = new List<ProjectTaskDTO>();

            foreach (var t in tasks)
            {
                var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == t.TaskId);

                var assignedMembers = t.Members.Select(ta => new MemberDTO
                {
                    Id = ta.Member.Id,
                    FirstName = ta.Member.FirstName,
                    LastName = ta.Member.LastName,
                    Email = ta.Member.Email,
                    RoleName = ta.Member.Role.RoleName,
                    RoleId = ta.Member.RoleId,
                    IsDisabled = ta.Member.IsDisabled,
                    DateOfBirth = ta.Member.DateOfBirth,
                    Status = ta.Member.Status

                }).ToList();

                tasksDTOs.Add(new ProjectTaskDTO
                {
                   Deadline = t.Deadline,
                   ProjectId = t.ProjectId,
                   TaskDescription= t.TaskDescription,
                   TaskId = t.TaskId,
                   TaskName = t.TaskName,
                   TaskStatus = t.TaskStatus.Name,
                   TaskStatusId = t.TaskStatusId,
                   StartDate = t.StartDate,
                   TaskPriorityId = t.TaskPriorityId,
                   IsTaskDependentOn = isTaskDependentOn,
                   TaskCategoryId = t.TaskCategoryId,
                   AssignedMembers = assignedMembers
                });

            }

            return Ok(tasksDTOs);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddProjectTasks(AddProjectTaskRequest addProjectTaskRequest)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 4);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var project = dbContext.Projects.FirstOrDefault(tp => tp.ProjectId == addProjectTaskRequest.ProjectId);

            if (project == null)
            {
                return NotFound("Project with this id not found.");
            }

            var projectTaskStatus = dbContext.TaskStatuses.FirstOrDefault(ps => ps.Id == 1);
            var taskPriority = dbContext.TaskPriority.First(tp => tp.TaskPriorityId == 1);
            var taskCategory = dbContext.TaskCategories.First(tc => tc.TaskCategoryID == 1);

            var projectTask = new ProjectTask()
            {
                Deadline = addProjectTaskRequest.Deadline,
                ProjectId = addProjectTaskRequest.ProjectId,
                TaskDescription = addProjectTaskRequest.TaskDescription,
                TaskName = addProjectTaskRequest.TaskName,
                TaskStatus = projectTaskStatus,
                TaskPriority = taskPriority,
                TaskCategory = taskCategory
            };

            Console.WriteLine(taskPriority.Name);

            dbContext.ProjectTasks.Add(projectTask);
            await dbContext.SaveChangesAsync();

            foreach (var memberId in addProjectTaskRequest.AssignedMemberIds)
            {
                var member = await dbContext.Members.FindAsync(memberId);
                if (member == null)
                {

                    return NotFound($"Member with ID {memberId} not found");
                }

                projectTask.Members.Add(new MemberTask { MemberId = memberId, TaskId = projectTask.TaskId });
            }

            await dbContext.SaveChangesAsync();

            var newProjectTask = await dbContext.ProjectTasks.FindAsync(projectTask.TaskId);

            var assignedMembers = await dbContext.MemberTasks
                .Include(mt => mt.Member).ThenInclude(mt => mt.Role)
                .Where(mt => mt.TaskId == newProjectTask.TaskId)
                .Select(mt => mt.Member)
                .ToListAsync();

            var assignedMemberDTOs = assignedMembers.Select(member => new MemberDTO
            {
                Id = member.Id,
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                RoleId = member.RoleId,
                RoleName = member.Role.RoleName,
                DateAdded = member.DateAdded,
                PhoneNumber = member.PhoneNumber,
                DateOfBirth = member.DateOfBirth,
                IsDisabled = member.IsDisabled

            }).ToList();

            var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == projectTask.TaskId);

            var tasksDTO = new ProjectTaskDTO
            {                 
                Deadline = projectTask.Deadline,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName,
                TaskStatus = projectTask.TaskStatus.Name,
                TaskStatusId = projectTask.TaskStatusId,
                StartDate = projectTask.StartDate,
                TaskPriorityId = projectTask.TaskPriorityId,
                IsTaskDependentOn = isTaskDependentOn,
                TaskCategoryId = taskCategory.TaskCategoryID,
                AssignedMembers = assignedMemberDTOs
            };

            foreach (var assignedMember in assignedMemberDTOs)
            {
                var request = new EmailDTO
                {
                    To = assignedMember.Email,
                    Subject = "New Task Assignment",
                    Body = $@"
                        <p>Hello {assignedMember.FirstName} {assignedMember.LastName},</p>
                        
                        <p>You have been assigned a new task.</p>
                        
                        <p>Below are your task details:</p>
                        
                        <ul>
                            <li><strong>Name:</strong> {tasksDTO.TaskName}</li>
                            <li><strong>Deadline:</strong> {tasksDTO.Deadline}</li>
                            <li><strong>Status:</strong> {tasksDTO.TaskStatus}</li>
                            <li><strong>Description:</strong> {tasksDTO.TaskDescription}</li>
                        </ul>"
                };

                var result = _emailService.SendEmail(request);
            }


            return Ok(tasksDTO);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectTask(int id, UpdateProjectTaskRequest updateProjectTaskRequest)
        {
            var projectTask = await dbContext.ProjectTasks
                .Include(ts => ts.TaskStatus)
                .Include(tp => tp.TaskPriority)
                .Include(tc => tc.TaskCategory)
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (projectTask == null)
            {
                return NotFound();
            }

            projectTask.Deadline = updateProjectTaskRequest.Deadline;
            projectTask.TaskDescription = updateProjectTaskRequest.TaskDescription;
            projectTask.TaskName = updateProjectTaskRequest.TaskName;

          
            dbContext.ProjectTasks.Update(projectTask);
            await dbContext.SaveChangesAsync();

            var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == projectTask.TaskId);


            var tasksDTO = new ProjectTaskDTO
            {
                Deadline = projectTask.Deadline,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName,
                TaskStatusId = projectTask.TaskStatusId,
                TaskStatus = projectTask.TaskStatus.Name,
                StartDate = projectTask.StartDate,
                TaskPriorityId = projectTask.TaskPriorityId,
                IsTaskDependentOn = isTaskDependentOn,
                TaskCategoryId = projectTask.TaskCategoryId
            };

            return Ok(tasksDTO);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 6);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var projectTask = await dbContext.ProjectTasks.FirstOrDefaultAsync(t => t.TaskId == id);

            if (projectTask == null)
            {
                return NotFound(); 
            }

            dbContext.ProjectTasks.Remove(projectTask);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Task is deleted" });
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectTaskById(int id)
        {
            var projectTask = await dbContext.ProjectTasks
               .Include(ts => ts.TaskStatus)
               .Include(tp => tp.TaskPriority)
               .Include(tc => tc.TaskCategory)
               .Include(ta => ta.Members)
                        .ThenInclude(tam => tam.Member)
                        .ThenInclude(tam => tam.Role)
               .FirstOrDefaultAsync(t => t.TaskId == id);

            if (projectTask == null)
            {
                return NotFound("Specified project does not exist"); 
            }

            var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == projectTask.TaskId);

            var assignedMembers = projectTask.Members.Select(ta => new MemberDTO
            {
                Id = ta.Member.Id,
                FirstName = ta.Member.FirstName,
                LastName = ta.Member.LastName,
                Email = ta.Member.Email,
                RoleName = ta.Member.Role.RoleName,
                RoleId = ta.Member.RoleId,
                IsDisabled = ta.Member.IsDisabled,
                DateOfBirth = ta.Member.DateOfBirth,
                Status = ta.Member.Status

            }).ToList();

            var taskDTO = new ProjectTaskDTO
            {
                Deadline = projectTask.Deadline,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName,
                TaskStatusId = projectTask.TaskStatusId,
                TaskStatus = projectTask.TaskStatus.Name,
                StartDate = projectTask.StartDate,
                TaskPriorityId = projectTask.TaskPriorityId,
                IsTaskDependentOn = isTaskDependentOn,
                TaskCategoryId = projectTask.TaskCategoryId,
                AssignedMembers = assignedMembers
            };

            return Ok(taskDTO); 
        }

        [HttpPut("{taskId}/status/{statusId}")]
        public async Task<IActionResult> UpdateTaskStatus(int taskId, int statusId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 11);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var projectTask = await dbContext.ProjectTasks.FindAsync(taskId);
            if (projectTask == null)
            {
                return NotFound("Specified project does not exist");
            }

            var projectTaskStatus = await dbContext.TaskStatuses.FindAsync(statusId);
            if (projectTaskStatus == null)
            {
                return NotFound("Specified task status does not exist.");
            }

            var statusBelongsToProject = await dbContext.ProjectTaskStatuses
                .AnyAsync(pts => pts.ProjectId == projectTask.ProjectId && pts.TaskStatusId == projectTaskStatus.Id);

            if (!statusBelongsToProject)
            {
                return BadRequest("Task Status does not belong to this project.");
            }

            if(statusId == 2)
            {
                projectTask.StartDate = DateTime.Now;
            }

            projectTask.TaskStatus = projectTaskStatus;
            await dbContext.SaveChangesAsync();

            return Ok("Task status is changed successfully!");
        }

        [Authorize]
        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetTasksByProject(int projectId)
        {
            var tasks = await dbContext.ProjectTasks
                .Where(t => t.ProjectId == projectId)
                .Include(ts => ts.TaskStatus)
                .Include(tp => tp.TaskPriority)
                .Include(tc => tc.TaskCategory)
                .ToListAsync();

            var taskDTOs = new List<ProjectTaskDTO>();

            foreach (var t in tasks)
            {
                var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == t.TaskId);

                taskDTOs.Add(new ProjectTaskDTO
                {
                    Deadline = t.Deadline,
                    ProjectId = t.ProjectId,
                    TaskDescription = t.TaskDescription,
                    TaskId = t.TaskId,
                    TaskName = t.TaskName,
                    TaskStatusId = t.TaskStatusId,
                    TaskStatus = t.TaskStatus.Name,
                    StartDate = t.StartDate,
                    TaskPriorityId = t.TaskPriorityId,
                    IsTaskDependentOn = isTaskDependentOn,
                    TaskCategoryId = t.TaskCategoryId
                });
            }

            return Ok(taskDTOs);
        }

        [Authorize]
        [HttpGet("project/{projectId}/priority/{priorityId}")]
        public async Task<IActionResult> GetTasksByProjectAndPriority(int projectId, int priorityId)
        {
            var tasks = await dbContext.ProjectTasks
                .Where(t => t.ProjectId == projectId && t.TaskPriorityId == priorityId)
                .Include(ts => ts.TaskStatus)
                .Include(tp => tp.TaskPriority)
                .Include(tc => tc.TaskCategory)
                .ToListAsync();

            var taskDTOs = new List<ProjectTaskDTO>();

            foreach (var t in tasks)
            {
                var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == t.TaskId);

                taskDTOs.Add(new ProjectTaskDTO
                {
                    Deadline = t.Deadline,
                    ProjectId = t.ProjectId,
                    TaskDescription = t.TaskDescription,
                    TaskId = t.TaskId,
                    TaskName = t.TaskName,
                    TaskStatusId = t.TaskStatusId,
                    TaskStatus = t.TaskStatus.Name,
                    StartDate = t.StartDate,
                    TaskPriorityId = t.TaskPriorityId,
                    IsTaskDependentOn = isTaskDependentOn,
                    TaskCategoryId = t.TaskCategoryId
                });
            }

            return Ok(taskDTOs);
        }

        [Authorize]
        [HttpPut("{taskId}/priority/{priorityId}")]
        public async Task<IActionResult> UpdateTaskPriority(int taskId, int priorityId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 14);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var projectTask = await dbContext.ProjectTasks.FindAsync(taskId);
            if (projectTask == null)
            {
                return NotFound("Specified task does not exist");
            }

            var taskPriority = await dbContext.TaskPriority.FindAsync(priorityId);
            if (taskPriority == null)
            {
                return NotFound("Specified task priority does not exist.");
            }

            projectTask.TaskPriority = taskPriority;
            await dbContext.SaveChangesAsync();

            return Ok("Task priority is changed successfully!");
        }

        [Authorize]
        [HttpPut("{taskId}/assign")]
        public async Task<IActionResult> AssignMemberToTask(int taskId, List<int> memberIds)
        {         
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 7);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var projectTask = await dbContext.ProjectTasks.Include(pt => pt.Project).FirstOrDefaultAsync(pt => pt.TaskId == taskId);

            if (projectTask == null)
            {
                return NotFound("Task not found");
            }

            foreach (var memberId in memberIds)
            {
                var member = await dbContext.Members.FindAsync(memberId);
                if (member == null)
                {
                    return NotFound($"Member with ID {memberId} not found.");
                }

                if (member.IsDisabled)
                {
                    return BadRequest($"Member with ID {memberId} is disabled.");
                }

                var memberProject = await dbContext.MemberProjects
                                                   .FirstOrDefaultAsync(mp => mp.ProjectId == projectTask.Project.ProjectId && mp.MemberId == memberId);

                if (memberProject == null)
                {
                    return Forbid($"User with ID {memberId} is not a member of the project to which this task belongs");
                }

                var existingMemberTask = dbContext.MemberTasks.FirstOrDefault(mt => mt.MemberId == memberId && mt.TaskId == taskId);

                if (existingMemberTask != null)
                {
                    return BadRequest($"Member with ID {memberId} is already assigned to this task");
                }

                projectTask.Members.Add(new MemberTask { MemberId = memberId, TaskId = taskId });

                var request = new EmailDTO
                {
                    To = member.Email,
                    Subject = "New Task Assignment",
                    Body = $@"
                        <p>Hello {member.FirstName} {member.LastName},</p>
                        
                        <p>You have been assigned a new task.</p>
                        
                        <p>Below are your task details:</p>
                        
                        <ul>
                            <li><strong>Name:</strong> {projectTask.TaskName}</li>
                            <li><strong>Deadline:</strong> {projectTask.Deadline}</li>
                            <li><strong>Status:</strong> {projectTask.TaskStatus}</li>
                            <li><strong>Description:</strong> {projectTask.TaskDescription}</li>
                        </ul>"
                };

                var result = _emailService.SendEmail(request);
            
            }

            await dbContext.SaveChangesAsync();

            return Ok("Members assigned to task successfully");
        }

        [Authorize]
        [HttpGet("members/{memberId}/tasks")]
        public async Task<IActionResult> GetMemberTasks(int memberId)
        {
            var member = await dbContext.Members.Include(m => m.Role).FirstOrDefaultAsync(m => m.Id == memberId);

            if (member == null)
            {
                return NotFound("Member does not exist.");
            }

            if (member.IsDisabled)
            {
                return Ok("This member is disabled.");
            }

            var memberTasks = await dbContext.MemberTasks
                .Where(mt => mt.MemberId == memberId)
                .Include(mt => mt.Task)
                .ThenInclude(t => t.TaskStatus)
                .Include(mt => mt.Task)
                .ThenInclude(t => t.TaskPriority)
                .Include(mt => mt.Task)
                .ThenInclude(tc => tc.TaskCategory)
                .ToListAsync();

            if (!memberTasks.Any())
            {
                return Ok("Member does not have any task.");
            }

            var taskDTOs = new List<ProjectTaskDTO>();

            foreach (var mt in memberTasks)
            {
                var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == mt.TaskId);

                var assignedMembers = await dbContext.MemberTasks.Include(t => t.Member).Where(t => t.TaskId == mt.TaskId)
                .Select(t => new MemberDTO
                 {
                   Id = t.Member.Id,
                   FirstName = t.Member.FirstName,
                   LastName = t.Member.LastName,
                   Email = t.Member.Email,
                   DateOfBirth = t.Member.DateOfBirth,
                   RoleName = t.Member.Role.RoleName,
                   Status = t.Member.Status,
                   RoleId = t.Member.RoleId
                }).ToListAsync();

                taskDTOs.Add(new ProjectTaskDTO
                {
                    Deadline = mt.Task.Deadline,
                    ProjectId = mt.Task.ProjectId,
                    TaskDescription = mt.Task.TaskDescription,
                    TaskId = mt.Task.TaskId,
                    TaskName = mt.Task.TaskName,
                    TaskStatusId = mt.Task.TaskStatusId,
                    TaskStatus = mt.Task.TaskStatus.Name,
                    StartDate = mt.Task.StartDate,
                    TaskPriorityId = mt.Task.TaskPriorityId,
                    IsTaskDependentOn = isTaskDependentOn,
                    TaskCategoryId = mt.Task.TaskCategoryId,
                    AssignedMembers = assignedMembers
                });
            }

            return Ok(taskDTOs);
        }

        [Authorize]
        [HttpPost("{taskId}/dependency/{dependentTaskId}")]
        public async Task<IActionResult> AddTaskDependency(int taskId, int dependentTaskId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 15);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var task = await dbContext.ProjectTasks.FindAsync(taskId);
            var dependentTask = await dbContext.ProjectTasks.FindAsync(dependentTaskId);

            if (task == null || dependentTask == null)
            {
                return NotFound("Specified task or dependent task does not exist.");
            }

            var existingDependency = await dbContext.TaskDependencies
                .FirstOrDefaultAsync(td => td.TaskId == taskId && td.DependentTaskId == dependentTaskId);

            if (existingDependency != null)
            {
                return BadRequest("Dependency already exists for the specified tasks.");
            }

            var newDependency = new TaskDependency
            {
                TaskId = taskId,
                DependentTaskId = dependentTaskId
            };

            dbContext.TaskDependencies.Add(newDependency);
            await dbContext.SaveChangesAsync();

            return Ok($"Dependency added between Task ID {taskId} and Dependent Task ID {dependentTaskId}.");
        }

        [Authorize]
        [HttpGet("{id}/DependentTasks")]
        public async Task<IActionResult> GetDependentTasks(int id)
        {
            var dependentTaskIds = await dbContext.TaskDependencies
                .Where(td => td.TaskId == id)
                .Select(td => td.DependentTaskId)
                .ToListAsync();

            if (dependentTaskIds == null || dependentTaskIds.Count == 0)
            {
                return NotFound("Specified task has no dependent tasks");
            }

            var dependentTasks = await dbContext.ProjectTasks
                .Where(pt => dependentTaskIds.Contains(pt.TaskId))
                .Include(pt => pt.DependentTasks)
                .Include(pt => pt.TaskStatus)
                .Include(pt => pt.TaskCategory)
                .Include(pt => pt.TaskCategory)
                .ToListAsync();

            var dependentTaskDTOs = dependentTasks.Select(dt => new ProjectTaskDTO
            {
                TaskId = dt.TaskId,
                TaskName = dt.TaskName,
                TaskDescription = dt.TaskDescription,
                StartDate = dt.StartDate,
                Deadline = dt.Deadline,
                ProjectId = dt.ProjectId,
                TaskStatusId = dt.TaskStatusId,
                TaskStatus = dt.TaskStatus.Name,
                TaskPriorityId = dt.TaskPriorityId,
                IsTaskDependentOn = dbContext.TaskDependencies.Any(td => td.TaskId == dt.TaskId),
                TaskCategoryId = dt.TaskCategoryId
            }).ToList();

            return Ok(dependentTaskDTOs);
        }


        [Authorize]
        [HttpDelete("{taskId}/dependency/{dependentTaskId}")]
        public async Task<IActionResult> RemoveTaskDependency(int taskId, int dependentTaskId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 16);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var task = await dbContext.ProjectTasks.FindAsync(taskId);
            var dependentTask = await dbContext.ProjectTasks.FindAsync(dependentTaskId);

            if (task == null || dependentTask == null)
            {
                return NotFound("Specified task or dependent task does not exist.");
            }

            var existingDependency = await dbContext.TaskDependencies
                .FirstOrDefaultAsync(td => td.TaskId == taskId && td.DependentTaskId == dependentTaskId);

            if (existingDependency == null)
            {
                return NotFound("Dependency does not exist between the specified tasks.");
            }

            
            dbContext.TaskDependencies.Remove(existingDependency);
            await dbContext.SaveChangesAsync();

            return Ok($"Dependency removed between Task ID {taskId} and Dependent Task ID {dependentTaskId}.");
        }

        [Authorize]
        [HttpPost("{taskId}/category/{categoryId}")]
        public async Task<IActionResult> AddTaskCategory(int taskId, int categoryId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 17);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }


            var task = await dbContext.ProjectTasks.FindAsync(taskId);
            var category = await dbContext.TaskCategories.FindAsync(categoryId);

            if (task == null || category == null)
            {
                return NotFound("Specified task or category does not exist.");
            }

            task.TaskCategoryId = categoryId;

            await dbContext.SaveChangesAsync();

            return Ok($"Category added to Task ID {taskId}.");
        }

        [Authorize]
        [HttpDelete("{taskId}/category")]
        public async Task<IActionResult> RemoveTaskCategory(int taskId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 18);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var task = await dbContext.ProjectTasks.FindAsync(taskId);

            if (task == null)
            {
                return NotFound("Specified task does not exist.");
            }

            task.TaskCategoryId = 1;

            await dbContext.SaveChangesAsync();

            return Ok($"Category removed from Task ID {taskId}.");
        }

        [Authorize]
        [HttpDelete("{taskId}/remove/{memberId}")]
        public async Task<IActionResult> RemoveMemberFromTask(int taskId, int memberId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (userIdClaim == null)
            {
                return NotFound("User ID claim not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID in token");
            }

            var roleId = await rolePermissionService.CheckRole(userId);

            var hasPermission = await rolePermissionService.CheckRolePermission(roleId.Value, 9);

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var projectTask = await dbContext.ProjectTasks
                                             .Include(pt => pt.Project).Include(pt => pt.Members)
                                             .FirstOrDefaultAsync(pt => pt.TaskId == taskId)
                                             ;

            if (projectTask == null)
            {
                return NotFound("Task not found");
            }

            var memberTask = projectTask.Members.FirstOrDefault(mt => mt.MemberId == memberId);

            if (memberTask == null)
            {
                return NotFound("Member is not assigned to this task");
            }

            projectTask.Members.Remove(memberTask);
            await dbContext.SaveChangesAsync();

            return Ok($"Member with ID {memberId} is removed from task with ID {taskId}");
        }

        [Authorize]
        [HttpGet("membertasks")]
        public async Task<IActionResult> GetAllMemberTasks()
        {

            var memberTasks = await dbContext.MemberTasks
                .Include(mt => mt.Member)
                    .ThenInclude(t => t.Role)
                .Include(mt => mt.Task)
                    .ThenInclude(t => t.TaskStatus)
                .Include(mt => mt.Task)
                    .ThenInclude(t => t.TaskPriority)
                .Include(mt => mt.Task)
                    .ThenInclude(tc => tc.TaskCategory)
                .ToListAsync();

            if (!memberTasks.Any())
            {
                return Ok("Member does not have any task.");
            }

            var taskDTOs = new List<MemberTaskDTO>();

            foreach (var mt in memberTasks)
            {
                var isTaskDependent = await dbContext.TaskDependencies.AnyAsync(td => td.TaskId == mt.TaskId);

                taskDTOs.Add(new MemberTaskDTO
                {
                    MemberId = mt.MemberId,
                    TaskId = mt.TaskId,
                    Member = new MemberDTO
                    {
                        Id = mt.Member.Id,
                        FirstName = mt.Member.FirstName,
                        LastName = mt.Member.LastName,
                        Email = mt.Member.Email,
                        DateOfBirth = mt.Member.DateOfBirth,
                        RoleName = mt.Member.Role.RoleName,
                        Status = mt.Member.Status
                    },
                    Task = new ProjectTaskDTO
                    {
                        Deadline = mt.Task.Deadline,
                        ProjectId = mt.Task.ProjectId,
                        TaskDescription = mt.Task.TaskDescription,
                        TaskId = mt.Task.TaskId,
                        TaskName = mt.Task.TaskName,
                        TaskStatusId = mt.Task.TaskStatusId,
                        TaskStatus = mt.Task.TaskStatus.Name,
                        StartDate = mt.Task.StartDate,
                        TaskPriorityId = mt.Task.TaskPriorityId,
                        TaskCategoryId = mt.Task.TaskCategoryId,
                        IsTaskDependentOn = isTaskDependent
                    }
                });
            }

            return Ok(taskDTOs);
        }

    }
}
