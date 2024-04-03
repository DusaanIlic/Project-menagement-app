using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.ProjectTaskStatus;
using Server.Models;
using TaskStatus = Server.Models.TaskStatus;

namespace Server.Controllers;

public partial class ProjectController
{
    [HttpGet("{projectId}/TaskStatus")]
    public async Task<IActionResult> GetTaskStatuses(int projectId)
    {
        var taskStatuses = await dbContext.TaskStatuses
            .Where(ts => ts.ProjectTaskStatuses.Any(pts => pts.ProjectId == projectId))
            .ToListAsync();
        
        var taskStatusDTOS = taskStatuses.Select(ts => new TaskStatusDTO 
        {
            Id = ts.Id,
            Name = ts.Name,
            IsDefault = ts.IsDefault
        }).ToList();

        return Ok(taskStatusDTOS);
    }

    [HttpPost("{projectId}/TaskStatus")]
    public async Task<IActionResult> AddTaskStatus(int projectId, AddTaskStatusRequest addTaskStatusRequest)
    {
        var projectExists = await dbContext.Projects.AnyAsync(p => p.ProjectId == projectId);

        if (!projectExists)
        {
            return NotFound("Project with given id not found.");
        } 
        
        var alreadyExists = await dbContext.TaskStatuses
            .AnyAsync(ts => ts.ProjectTaskStatuses.Any(pts => pts.ProjectId == projectId) &&
                       ts.Name == addTaskStatusRequest.Name);

        if (alreadyExists)
        {
            return Conflict("Task Status with same name already exists.");
        }
        
        var taskStatus = new TaskStatus
        {
            Name = addTaskStatusRequest.Name
        };

        dbContext.TaskStatuses.Add(taskStatus);
        await dbContext.SaveChangesAsync();

        var projectTaskStatus = new ProjectTaskStatus
        {
            ProjectId = projectId,
            TaskStatusId = taskStatus.Id
        };

        dbContext.ProjectTaskStatuses.Add(projectTaskStatus);
        await dbContext.SaveChangesAsync();

        var taskStatusDTO = new TaskStatusDTO
        {
            Id = taskStatus.Id,
            Name = taskStatus.Name,
            IsDefault = taskStatus.IsDefault
        };

        return Ok(taskStatusDTO);
    }

    [HttpDelete("{projectId}/TaskStatus/{taskStatusId}")]
    public async Task<IActionResult> DeleteTaskStatus(int projectId, int taskStatusId)
    {
        var projectTaskStatus = await dbContext.ProjectTaskStatuses
            .FirstOrDefaultAsync(pts => pts.ProjectId == projectId && pts.TaskStatusId == taskStatusId);

        if (projectTaskStatus == null)
        {
            return NotFound();
        }
        
        var taskStatus = await dbContext.TaskStatuses
            .Include(ts => ts.ProjectTasks)
            .FirstOrDefaultAsync(ts => ts.Id == taskStatusId);

        if (taskStatus == null)
        {
            return NotFound("Task status sa datim id-om ne postoji.");
        }

        if (taskStatus.IsDefault)
        {
            return Conflict("Zabranjeno je brisati ovaj task status.");
        }

        if (taskStatus.ProjectTasks.Count > 0)
        {
            return Conflict("Postoje taskovi sa ovim statusom.");
        }

        dbContext.ProjectTaskStatuses.Remove(projectTaskStatus);
        dbContext.TaskStatuses.Remove(taskStatus);

        await dbContext.SaveChangesAsync();
        
        return NoContent();
    }
}