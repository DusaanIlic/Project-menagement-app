using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request;
using Server.DataTransferObjects.Request.ProjectTask;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public TaskController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjectTasks()
        {
            var tasks = await dbContext.ProjectTasks
                .Include(p => p.Project)
                .Include(ts => ts.ProjectTaskStatus)
                .Include(tp => tp.TaskPriority)
                .ToListAsync();

            var tasksDTOs = new List<ProjectTaskDTO>();

            foreach (var t in tasks)
            {
                var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == t.TaskId);

                tasksDTOs.Add(new ProjectTaskDTO
                {
                   Deadline = t.Deadline,
                   ProjectId = t.ProjectId,
                   TaskDescription= t.TaskDescription,
                   TaskId = t.TaskId,
                   TaskName = t.TaskName,
                   TaskStatus = t.ProjectTaskStatus.Name,
                   TaskStatusId = t.ProjectTaskStatusId,
                   StartDate = t.StartDate,
                   TaskPriorityId = t.TaskPriorityId,
                   IsTaskDependentOn = isTaskDependentOn

                });

            }

            return Ok(tasksDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddProjectTasks(AddProjectTaskRequest addProjectTaskRequest)
        {
            var projectTaskStatus = dbContext.ProjectTaskStatuses.FirstOrDefault(ps => ps.Id == 1);
            var taskPriority = dbContext.TaskPriority.First(tp => tp.TaskPriorityId == 1);

            var projectTask = new ProjectTask()
            {
                Deadline = addProjectTaskRequest.Deadline,
                ProjectId = addProjectTaskRequest.ProjectId,
                TaskDescription = addProjectTaskRequest.TaskDescription,
                TaskName = addProjectTaskRequest.TaskName,
                ProjectTaskStatus = projectTaskStatus,
                TaskPriority = taskPriority

            };

            Console.WriteLine(taskPriority.Name);

            dbContext.ProjectTasks.Add(projectTask);
            await dbContext.SaveChangesAsync();

            var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == projectTask.TaskId);

            var tasksDTO = new ProjectTaskDTO
            {                 
                Deadline = projectTask.Deadline,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName,
                TaskStatus = projectTask.ProjectTaskStatus.Name,
                TaskStatusId = projectTask.ProjectTaskStatusId,
                StartDate = projectTask.StartDate,
                TaskPriorityId = projectTask.TaskPriorityId,
                IsTaskDependentOn = isTaskDependentOn
            };

            return Ok(tasksDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectTask(int id, UpdateProjectTaskRequest updateProjectTaskRequest)
        {
            var projectTask = await dbContext.ProjectTasks
                .Include(ts => ts.ProjectTaskStatus)
                .Include(tp => tp.TaskPriority)
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
                TaskStatusId = projectTask.ProjectTaskStatusId,
                TaskStatus = projectTask.ProjectTaskStatus.Name,
                StartDate = projectTask.StartDate,
                TaskPriorityId = projectTask.TaskPriorityId,
                IsTaskDependentOn = isTaskDependentOn
            };

            return Ok(tasksDTO);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            var projectTask = await dbContext.ProjectTasks.FirstOrDefaultAsync(t => t.TaskId == id);

            if (projectTask == null)
            {
                return NotFound(); 
            }

            dbContext.ProjectTasks.Remove(projectTask);
            await dbContext.SaveChangesAsync();

            return Ok("Task is deleted");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectTaskById(int id)
        {
            var projectTask = await dbContext.ProjectTasks
               .Include(ts => ts.ProjectTaskStatus)
               .Include(tp => tp.TaskPriority)
               .FirstOrDefaultAsync(t => t.TaskId == id);

            if (projectTask == null)
            {
                return NotFound(); 
            }

            var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == projectTask.TaskId);


            var taskDTO = new ProjectTaskDTO
            {
                Deadline = projectTask.Deadline,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName,
                TaskStatusId = projectTask.ProjectTaskStatusId,
                TaskStatus = projectTask.ProjectTaskStatus.Name,
                StartDate = projectTask.StartDate,
                TaskPriorityId = projectTask.TaskPriorityId,
                IsTaskDependentOn = isTaskDependentOn
            };

            return Ok(taskDTO); 
        }

        [HttpPut("{taskId}/status/{statusId}")]
        public async Task<IActionResult> UpdateTaskStatus(int taskId, int statusId)
        {
            var projectTask = await dbContext.ProjectTasks.FindAsync(taskId);
            if (projectTask == null)
            {
                return NotFound();
            }

            var projectTaskStatus = await dbContext.ProjectTaskStatuses.FindAsync(statusId);
            if (projectTaskStatus == null)
            {
                return NotFound("Specified task status does not exist.");
            }

            if(statusId == 2)
            {
                projectTask.StartDate = DateTime.Now;
            }

            projectTask.ProjectTaskStatus = projectTaskStatus;
            await dbContext.SaveChangesAsync();

            return Ok("Task status is changed successfully!");
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetTasksByProject(int projectId)
        {
            var tasks = await dbContext.ProjectTasks
                .Where(t => t.ProjectId == projectId)
                .Include(ts => ts.ProjectTaskStatus)
                .Include(tp => tp.TaskPriority)
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
                    TaskStatusId = t.ProjectTaskStatusId,
                    TaskStatus = t.ProjectTaskStatus.Name,
                    StartDate = t.StartDate,
                    TaskPriorityId = t.TaskPriorityId,
                    IsTaskDependentOn = isTaskDependentOn
                });
            }

            return Ok(taskDTOs);
        }

        [HttpGet("project/{projectId}/priority/{priorityId}")]
        public async Task<IActionResult> GetTasksByProjectAndPriority(int projectId, int priorityId)
        {
            var tasks = await dbContext.ProjectTasks
                .Where(t => t.ProjectId == projectId && t.TaskPriorityId == priorityId)
                .Include(ts => ts.ProjectTaskStatus)
                .Include(tp => tp.TaskPriority)
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
                    TaskStatusId = t.ProjectTaskStatusId,
                    TaskStatus = t.ProjectTaskStatus.Name,
                    StartDate = t.StartDate,
                    TaskPriorityId = t.TaskPriorityId,
                    IsTaskDependentOn = isTaskDependentOn
                });
            }

            return Ok(taskDTOs);
        }

        [HttpPut("{taskId}/priority/{priorityId}")]
        public async Task<IActionResult> UpdateTaskPriority(int taskId, int priorityId)
        {
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

        [HttpPut("{taskId}/assign/{memberId}")]
        public async Task<IActionResult> AssignMemberToTask(int taskId, int memberId)
        {         
            var projectTask = await dbContext.ProjectTasks.FindAsync(taskId);
            if (projectTask == null)
            {
                return NotFound("Task not found");
            }

            var member = await dbContext.Members.FindAsync(memberId);
            if (member == null)
            {
                return NotFound("Member not found");
            }

            if (projectTask.Members.Any(mt => mt.MemberId == memberId))
            {
                return BadRequest("Member is already assigned to this task");
            }

            projectTask.Members.Add(new MemberTask { MemberId = memberId, TaskId = taskId });
            await dbContext.SaveChangesAsync();

            return Ok($"Member with ID {memberId} is assigned to task with ID {taskId}");
        }

        [HttpGet("members/{memberId}/tasks")]
        public async Task<IActionResult> GetMemberTasks(int memberId)
        {
            var member = await dbContext.Members.FindAsync(memberId);
            if (member == null)
            {
                return NotFound("Member does not exist.");
            }

            var memberTasks = await dbContext.MemberTasks
                .Where(mt => mt.MemberId == memberId)
                .Include(mt => mt.Task)
                .ThenInclude(t => t.ProjectTaskStatus)
                .Include(mt => mt.Task)
                .ThenInclude(t => t.TaskPriority)
                .ToListAsync();

            if (!memberTasks.Any())
            {
                return Ok("Member does not have any task.");
            }

            var taskDTOs = new List<ProjectTaskDTO>();

            foreach (var mt in memberTasks)
            {
                var isTaskDependentOn = await dbContext.TaskDependencies.AnyAsync(td => td.DependentTaskId == mt.TaskId);

                taskDTOs.Add(new ProjectTaskDTO
                {
                    Deadline = mt.Task.Deadline,
                    ProjectId = mt.Task.ProjectId,
                    TaskDescription = mt.Task.TaskDescription,
                    TaskId = mt.Task.TaskId,
                    TaskName = mt.Task.TaskName,
                    TaskStatusId = mt.Task.ProjectTaskStatusId,
                    TaskStatus = mt.Task.ProjectTaskStatus.Name,
                    StartDate = mt.Task.StartDate,
                    TaskPriorityId = mt.Task.TaskPriorityId,
                    IsTaskDependentOn = isTaskDependentOn
                });
            }

            return Ok(taskDTOs);
        }

        [HttpPost("{taskId}/dependency/{dependentTaskId}")]
        public async Task<IActionResult> AddTaskDependency(int taskId, int dependentTaskId)
        {
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

        [HttpDelete("{taskId}/dependency/{dependentTaskId}")]
        public async Task<IActionResult> RemoveTaskDependency(int taskId, int dependentTaskId)
        {
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
    }
}
