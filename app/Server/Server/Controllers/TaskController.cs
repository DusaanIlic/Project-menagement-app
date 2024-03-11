using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            var tasks = await dbContext.ProjectTasks.Include(p => p.Project).ToListAsync();
            var tasksDTOs = new List<ProjectTaskDTO>();

            foreach (var t in tasks)
            {

                tasksDTOs.Add(new ProjectTaskDTO
                {
                   DeadLine = t.DeadLine,
                   ProjectId = t.ProjectId,
                   TaskDescription= t.TaskDescription,
                   TaskId = t.TaskId,
                   TaskName = t.TaskName
                });

            }

            return Ok(tasksDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddProjectTasks(AddProjectTaskRequest addProjectTaskRequest)
        {

            var projectTask = new ProjectTask()
            {
                DeadLine = addProjectTaskRequest.DeadLine,
                ProjectId = addProjectTaskRequest.ProjectId,
                TaskDescription =  addProjectTaskRequest.TaskDescription,
                TaskName = addProjectTaskRequest.TaskName
            };

            dbContext.ProjectTasks.Add(projectTask);
            await dbContext.SaveChangesAsync();

            var tasksDTO = new ProjectTaskDTO
            {                 
                DeadLine = projectTask.DeadLine,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName
            };

            return Ok(tasksDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectTask(int id, UpdateProjectTaskRequest updateProjectTaskRequest)
        {
            var projectTask = await dbContext.ProjectTasks.FindAsync(id);

            if (projectTask == null)
            {
                return NotFound();
            }

            projectTask.DeadLine = updateProjectTaskRequest.DeadLine;
            projectTask.TaskDescription = updateProjectTaskRequest.TaskDescription;
            projectTask.TaskName = updateProjectTaskRequest.TaskName;

          
            dbContext.ProjectTasks.Update(projectTask);
            await dbContext.SaveChangesAsync();

            var tasksDTO = new ProjectTaskDTO
            {
                DeadLine = projectTask.DeadLine,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName
            };

            return Ok(tasksDTO);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            var projectTask = await dbContext.ProjectTasks.FindAsync(id);

            if (projectTask == null)
            {
                return NotFound(); 
            }

            dbContext.ProjectTasks.Remove(projectTask);
            await dbContext.SaveChangesAsync();

            var tasksDTO = new ProjectTaskDTO
            {
                DeadLine = projectTask.DeadLine,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName
            };

            return Ok(tasksDTO);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectTaskById(int id)
        {
            var projectTask = await dbContext.ProjectTasks.FindAsync(id);

            if (projectTask == null)
            {
                return NotFound(); 
            }

            var taskDTO = new ProjectTaskDTO
            {
                DeadLine = projectTask.DeadLine,
                ProjectId = projectTask.ProjectId,
                TaskDescription = projectTask.TaskDescription,
                TaskId = projectTask.TaskId,
                TaskName = projectTask.TaskName
            };

            return Ok(taskDTO); 
        }
    }
}
