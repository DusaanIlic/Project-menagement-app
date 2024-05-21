using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Evaluation;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request;
using Server.DataTransferObjects.Request.Notification;
using Server.DataTransferObjects.Request.ProjectTask;
using Server.Models;
using Server.Services.Notification;
using Server.Services.Permission;
using System.Threading.Tasks;
using Server.Services.File;
using Server.DataTransferObjects.Request.File;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;
        private readonly IPermissionService _permissionService;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly IFileService _fileService;

        public TaskController(LogicTenacityDbContext dbContext, IPermissionService permissionService, IEmailService emailService, INotificationService notificationService, IFileService fileService)
        {
            this.dbContext = dbContext;
            _permissionService = permissionService;
            _emailService = emailService;
            _notificationService = notificationService;
            _fileService = fileService;
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
                .Include(tp => tp.TaskCategory)
                .ToListAsync();

            var tasksDTOs = new List<ProjectTaskDTO>();

            foreach (var t in tasks)
            {

                var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == t.TaskId);
                var taskPriority = await dbContext.TaskPriority.FirstOrDefaultAsync(tp => tp.TaskPriorityId == t.TaskPriorityId);
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
                    TaskDescription = t.TaskDescription,
                    TaskId = t.TaskId,
                    TaskName = t.TaskName,
                    TaskStatus = t.TaskStatus.Name,
                    TaskStatusId = t.TaskStatusId,
                    StartDate = t.StartDate,
                    TaskPriorityId = t.TaskPriorityId,
                    IsTaskDependentOn = isTaskDependentOn,
                    TaskCategoryId = t.TaskCategoryId,
                    AssignedMembers = assignedMembers,
                    TaskPriorityName = taskPriority.Name,
                    DateFinished = t.DateFinished,
                    DeadlineModified = t.DeadlineModified

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
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(addProjectTaskRequest.ProjectId, "Create task");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var project = dbContext.Projects.FirstOrDefault(tp => tp.ProjectId == addProjectTaskRequest.ProjectId);

            if (project == null)
            {
                return NotFound(new { message = "Project with this id not found." });
            }

            var projectTaskStatus = dbContext.TaskStatuses.FirstOrDefault(ps => ps.Id == addProjectTaskRequest.TaskPriorityId);
            var taskPriority = dbContext.TaskPriority.First(tp => tp.TaskPriorityId == addProjectTaskRequest.TaskPriorityId);
            var taskCategory = dbContext.TaskCategories.First(tc => tc.TaskCategoryID == 1);

            var projectTask = new ProjectTask()
            {
                Deadline = addProjectTaskRequest.Deadline,
                ProjectId = addProjectTaskRequest.ProjectId,
                TaskDescription = addProjectTaskRequest.TaskDescription,
                TaskName = addProjectTaskRequest.TaskName,
                TaskStatus = projectTaskStatus,
                TaskPriority = taskPriority,
                StartDate = DateTime.Now,
                TaskCategory = taskCategory,
            };

            dbContext.ProjectTasks.Add(projectTask);
            await dbContext.SaveChangesAsync();

            foreach (var memberId in addProjectTaskRequest.AssignedMemberIds)
            {
                var member = await dbContext.Members.FindAsync(memberId);
                if (member == null)
                {

                    return NotFound(new { message = $"Member with ID {memberId} not found" });
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
                AssignedMembers = assignedMemberDTOs,
                TaskPriorityName = taskPriority.Name
            };

            var projectTaskCategory = new ProjectTaskCategories
            {
                ProjectId = projectTask.ProjectId,
                TaskCategoryId = taskCategory.TaskCategoryID
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


                SendNotificationRequest sendNotificationRequest = new SendNotificationRequest
                {
                    Title = "You are added to new task!",
                    Description = "Your new task is " + addProjectTaskRequest.TaskName,
                    MemberId = assignedMember.Id
                };

                await _notificationService.SendNotification(sendNotificationRequest);

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
                return NotFound(new { message = "Task not found" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Change task");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
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
                TaskCategoryId = projectTask.TaskCategoryId,
                TaskPriorityName = projectTask.TaskPriority.Name,
                DateFinished = projectTask.DateFinished,
                DeadlineModified = projectTask.DeadlineModified
            };

            return Ok(tasksDTO);
        }

        [Authorize]
        [HttpPut("{id}/ChangeDates")]
        public async Task<IActionResult> ChangeTaskDates(int id, ChangeTaskDatesRequest changeTaskDatesRequest)
        {
            var projectTask = await dbContext.ProjectTasks
                .Include(ts => ts.TaskStatus)
                .Include(tp => tp.TaskPriority)
                .Include(tc => tc.TaskCategory)
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (projectTask == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            if (changeTaskDatesRequest.startDate > changeTaskDatesRequest.deadline)
            {
                return BadRequest(new { message = "Start date can't be greater than deadline" });
            }

            projectTask.StartDate = changeTaskDatesRequest.startDate;
            projectTask.Deadline = changeTaskDatesRequest.deadline;

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
                TaskCategoryId = projectTask.TaskCategoryId,
            };

            return Ok(tasksDTO);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            var projectTask = await dbContext.ProjectTasks
                .Include(pt => pt.TaskActivities)
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (projectTask == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Delete task");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            dbContext.TaskActivities.RemoveRange(projectTask.TaskActivities);

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
                return NotFound(new { message = "Specified project does not exist" });
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
                AssignedMembers = assignedMembers,
                TaskPriorityName = projectTask.TaskPriority.Name,
                DateFinished = projectTask.DateFinished,
                DeadlineModified = projectTask.DeadlineModified
            };

            return Ok(taskDTO);
        }

        [HttpPut("{taskId}/status/{statusId}")]
        public async Task<IActionResult> UpdateTaskStatus(int taskId, int statusId)
        {
            var projectTask = await dbContext.ProjectTasks.FindAsync(taskId);
            if (projectTask == null)
            {
                return NotFound(new { message = "Specified project does not exist" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Change task status");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var projectTaskStatus = await dbContext.TaskStatuses.FindAsync(statusId);
            if (projectTaskStatus == null)
            {
                return NotFound(new { message = "Specified task status does not exist." });
            }

            var statusBelongsToProject = await dbContext.ProjectTaskStatuses
                .AnyAsync(pts => pts.ProjectId == projectTask.ProjectId && pts.TaskStatusId == projectTaskStatus.Id);

            if (!statusBelongsToProject)
            {
                return BadRequest(new { message = "Task Status does not belong to this project." });
            }

            if (statusId == 2)
            {
                projectTask.StartDate = DateTime.Now;
            }

            if (statusId == 3)
            {
                projectTask.DateFinished = DateTime.Now;
            }

            projectTask.TaskStatus = projectTaskStatus;
            await dbContext.SaveChangesAsync();

            var members = await dbContext.Members
                             .Where(m => dbContext.MemberTasks
                                                .Any(mt => mt.TaskId == taskId && mt.MemberId == m.Id) && !m.IsDisabled)
                             .Include(m => m.Role)
                             .ToListAsync();

            foreach (var member in members)
            {
                SendNotificationRequest sendNotificationRequest = new SendNotificationRequest
                {
                    Title = "Task Status Updated!",
                    Description = $"The status for task '{projectTask.TaskName}' has been updated to '{projectTaskStatus.Name}'.",
                    MemberId = member.Id
                };

                await _notificationService.SendNotification(sendNotificationRequest);
            }

            return Ok(new { message = "Task status updated successfully." });

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
                .Include(ts => ts.Members)
                         .ThenInclude(p => p.Member)
                         .ThenInclude(p => p.Role)
                .ToListAsync();

            var taskDTOs = new List<ProjectTaskDTO>();

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
                    TaskCategoryId = t.TaskCategoryId,
                    AssignedMembers = assignedMembers,
                    TaskPriorityName = t.TaskPriority.Name,
                    DeadlineModified = t.DeadlineModified,
                    DateFinished = t.DateFinished
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
                    TaskCategoryId = t.TaskCategoryId,
                    TaskPriorityName = t.TaskPriority.Name
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
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var projectTask = await dbContext.ProjectTasks.FindAsync(taskId);
            if (projectTask == null)
            {
                return NotFound(new { message = "Specified task does not exist" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Change task priority");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var taskPriority = await dbContext.TaskPriority.FindAsync(priorityId);
            if (taskPriority == null)
            {
                return NotFound(new { message = "Specified task priority does not exist." });
            }

            projectTask.TaskPriority = taskPriority;
            await dbContext.SaveChangesAsync();

            var members = await dbContext.Members
                              .Where(m => dbContext.MemberTasks
                                                 .Any(mt => mt.TaskId == taskId && mt.MemberId == m.Id) && !m.IsDisabled)
                              .Include(m => m.Role)
                              .ToListAsync();

            foreach (var member in members)
            {
                SendNotificationRequest sendNotificationRequest = new SendNotificationRequest
                {
                    Title = "Task Priority Updated!",
                    Description = $"The priority for task '{projectTask.TaskName}' has been updated to '{taskPriority.Name}'.",
                    MemberId = member.Id
                };

                await _notificationService.SendNotification(sendNotificationRequest);
            }


            return Ok(new { message = "Task priority changed successfully." });

        }

        [Authorize]
        [HttpPut("{taskId}/assign")]
        public async Task<IActionResult> AssignMemberToTask(int taskId, List<int> memberIds)
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

            var projectTask = await dbContext.ProjectTasks.Include(pt => pt.Project).FirstOrDefaultAsync(pt => pt.TaskId == taskId);

            if (projectTask == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Add member to task");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }


            foreach (var memberId in memberIds)
            {
                var member = await dbContext.Members.FindAsync(memberId);
                if (member == null)
                {
                    return NotFound(new { message = $"Member with ID {memberId} not found." });
                }

                if (member.IsDisabled)
                {
                    return BadRequest(new { message = $"Member with ID {memberId} is disabled." });
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
                    return BadRequest(new { message = $"Member with ID {memberId} is already assigned to this task" });
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


                SendNotificationRequest sendNotificationRequest = new SendNotificationRequest
                {
                    Title = "You are added to new task!",
                    Description = "Your new task is " + projectTask.TaskName,
                    MemberId = memberId
                };

                await _notificationService.SendNotification(sendNotificationRequest);

            }

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Member assigned to task successfully." });

        }

        [Authorize]
        [HttpGet("members/{memberId}/tasks")]
        public async Task<IActionResult> GetMemberTasks(int memberId)
        {
            var member = await dbContext.Members.Include(m => m.Role).FirstOrDefaultAsync(m => m.Id == memberId);

            if (member == null)
            {
                return NotFound(new { message = "Member does not exist." });
            }

            if (member.IsDisabled)
            {
                return Ok(new { message = "This member is disabled." });

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
                    AssignedMembers = assignedMembers,
                    TaskPriorityName = mt.Task.TaskPriority.Name
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
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var task = await dbContext.ProjectTasks.FindAsync(taskId);

            var dependentTask = await dbContext.ProjectTasks.FindAsync(dependentTaskId);

            if (task == null || dependentTask == null)
            {
                return NotFound(new { message = "Specified task or dependent task does not exist." });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(task.ProjectId, "Add task dependency");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var existingDependency = await dbContext.TaskDependencies
                .FirstOrDefaultAsync(td => td.TaskId == taskId && td.DependentTaskId == dependentTaskId);

            if (existingDependency != null)
            {
                return BadRequest(new { message = "Dependency already exists for the specified tasks." });
            }

            var newDependency = new TaskDependency
            {
                TaskId = taskId,
                DependentTaskId = dependentTaskId
            };

            dbContext.TaskDependencies.Add(newDependency);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Task dependency added successfully." });

        }

        [Authorize]
        [HttpGet("{id}/DependentTasks")]
        public async Task<IActionResult> GetDependentTasks(int id)
        {
            var dependentTaskIds = await dbContext.TaskDependencies
                .Where(td => td.TaskId == id)
                .Select(td => td.DependentTaskId)
                .ToListAsync();


            var dependentTasks = await dbContext.ProjectTasks
                .Where(pt => dependentTaskIds.Contains(pt.TaskId))
                .Include(pt => pt.DependentTasks)
                .Include(pt => pt.TaskStatus)
                .Include(pt => pt.TaskCategory)
                .Include(pt => pt.TaskPriority)
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
                TaskCategoryId = dt.TaskCategoryId,
                TaskPriorityName = dt.TaskPriority.Name
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
                return NotFound(new { message = "User ID claim not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            var task = await dbContext.ProjectTasks.FindAsync(taskId);
            var dependentTask = await dbContext.ProjectTasks.FindAsync(dependentTaskId);

            if (task == null || dependentTask == null)
            {
                return NotFound(new { message = "Specified task or dependent task does not exist." });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(task.ProjectId, "Remove task dependency");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            var existingDependency = await dbContext.TaskDependencies
                .FirstOrDefaultAsync(td => td.TaskId == taskId && td.DependentTaskId == dependentTaskId);

            if (existingDependency == null)
            {
                return NotFound(new { message = "Dependency does not exist between the specified tasks." });
            }


            dbContext.TaskDependencies.Remove(existingDependency);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Task dependency deleted." });

        }

        [Authorize]
        [HttpPost("{taskId}/category/{categoryId}")]
        public async Task<IActionResult> AddTaskCategory(int taskId, int categoryId)
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

            var task = await dbContext.ProjectTasks.FindAsync(taskId);

            var category = await dbContext.TaskCategories.FindAsync(categoryId);

            if (task == null || category == null)
            {
                return NotFound(new { message = "Specified task or category does not exist." });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(task.ProjectId, "Add task category");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            task.TaskCategoryId = categoryId;
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Category added successfully." });

        }

        [Authorize]
        [HttpDelete("{taskId}/category")]
        public async Task<IActionResult> RemoveTaskCategory(int taskId)
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

            var task = await dbContext.ProjectTasks.FindAsync(taskId);

            if (task == null)
            {
                return NotFound(new { message = "Specified task does not exist." });
            }

            var hasPermission = await _permissionService.HasProjectPermissionAsync(task.ProjectId, "Remove task category");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            task.TaskCategoryId = 1;

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Category removed successfully" });

        }

        [Authorize]
        [HttpDelete("{taskId}/remove/{memberId}")]
        public async Task<IActionResult> RemoveMemberFromTask(int taskId, int memberId)
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

            var projectTask = await dbContext.ProjectTasks
                                             .Include(pt => pt.Project).Include(pt => pt.Members)
                                             .FirstOrDefaultAsync(pt => pt.TaskId == taskId);

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Remove member from task");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            if (projectTask == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            var memberTask = projectTask.Members.FirstOrDefault(mt => mt.MemberId == memberId);

            if (memberTask == null)
            {
                return NotFound(new { message = "Member is not assigned to this task" });
            }

            projectTask.Members.Remove(memberTask);
            await dbContext.SaveChangesAsync();

            SendNotificationRequest sendNotificationRequest = new SendNotificationRequest
            {
                Title = "Removed from Task",
                Description = $"You have been removed from the task '{projectTask.TaskName}'.",
                MemberId = memberId
            };

            await _notificationService.SendNotification(sendNotificationRequest);

            return Ok(new { message = "Member is removed from task successfully." });

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
                return Ok(new { message = "Member does not have any task." });

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
                        IsTaskDependentOn = isTaskDependent,
                        TaskPriorityName = mt.Task.TaskPriority.Name
                    }
                });
            }

            return Ok(taskDTOs);
        }

        [Authorize]
        [HttpPut("{taskId}/updateDeadline/{newDeadline}")]
        public async Task<IActionResult> UpdateDeadlineModified(int taskId, DateTime newDeadline)
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

            var projectTask = await dbContext.ProjectTasks
                                             .FirstOrDefaultAsync(pt => pt.TaskId == taskId);

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Change deadline");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }

            if (projectTask == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            projectTask.DeadlineModified = newDeadline;

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Task deadline changed successfully." });
        }

        [Authorize]
        [HttpGet("{id}/Files")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTaskFiles(int id)
        {
            var task = await dbContext.Task.FindAsync(id);

            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }

            var taskFiles = await dbContext.TaskFile
                .Where(pf => pf.TaskId == id)
                .Select(pf => new
                {
                    FileId = pf.FileId,
                })
                .ToListAsync();



            return Ok(taskFiles);
        }

        [Authorize]
        [HttpPost("{id}/files")]
        public async Task<IActionResult> PostFiles(int id, [FromForm] AddFilesRequest files)
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

            var hasPermission = await _permissionService.HasProjectPermissionAsync(projectTask.ProjectId, "Add file");

            if (!hasPermission)
            {
                return Forbid("Insufficient permissions");
            }


            var task = await dbContext.Task.FindAsync(id);

            if (task == null)
            {
                return NotFound(new { message = "Task not found." });
            }


            var uploadedFiles = await _fileService.PostMultiFileAsync(id, files);

            foreach (var uploadedFile in uploadedFiles)
            {
                var tasktFile = new TasktFile
                {
                    TaskId = id,
                    FileId = uploadedFile.FileId
                };
                project.TaskFiles.Add(tasktFile);

            }

            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Files posted successfully." });
        }

    }
}
