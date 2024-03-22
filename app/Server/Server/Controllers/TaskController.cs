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
                   TaskPriorityId = t.TaskPriorityId

                });

            }

            return Ok(tasksDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddProjectTasks(AddProjectTaskRequest addProjectTaskRequest)
        {
            var projectTaskStatus = dbContext.ProjectTaskStatuses.FirstOrDefault(ps => ps.Id == 1);

            var projectTask = new ProjectTask()
            {
                Deadline = addProjectTaskRequest.Deadline,
                ProjectId = addProjectTaskRequest.ProjectId,
                TaskDescription =  addProjectTaskRequest.TaskDescription,
                TaskName = addProjectTaskRequest.TaskName,
                ProjectTaskStatus = projectTaskStatus

            };

            dbContext.ProjectTasks.Add(projectTask);
            await dbContext.SaveChangesAsync();

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
                TaskPriorityId = projectTask.TaskPriorityId
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

            projectTask.Deadline = updateProjectTaskRequest.DeadLine;
            projectTask.TaskDescription = updateProjectTaskRequest.TaskDescription;
            projectTask.TaskName = updateProjectTaskRequest.TaskName;

          
            dbContext.ProjectTasks.Update(projectTask);
            await dbContext.SaveChangesAsync();

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
                TaskPriorityId = projectTask.TaskPriorityId
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
                TaskPriorityId = projectTask.TaskPriorityId
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

            var taskDTOs = tasks.Select(t => new ProjectTaskDTO
            {
                Deadline = t.Deadline,
                ProjectId = t.ProjectId,
                TaskDescription = t.TaskDescription,
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                TaskStatusId = t.ProjectTaskStatusId,
                TaskStatus = t.ProjectTaskStatus.Name,
                StartDate = t.StartDate,
                TaskPriorityId = t.TaskPriorityId
            }).ToList();

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

            var taskDTOs = tasks.Select(t => new ProjectTaskDTO
            {
                Deadline = t.Deadline,
                ProjectId = t.ProjectId,
                TaskDescription = t.TaskDescription,
                TaskId = t.TaskId,
                TaskName = t.TaskName,
                TaskStatusId = t.ProjectTaskStatusId,
                TaskStatus = t.ProjectTaskStatus.Name,
                StartDate = t.StartDate,
                TaskPriorityId = t.TaskPriorityId
            }).ToList();

            return Ok(taskDTOs);
        }
    }
}
