using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.DataTransferObjects.Request.ProjectStatus;
using Server.DataTransferObjects;
using Server.Models;
using Microsoft.EntityFrameworkCore;
using Server.DataTransferObjects.Request.TaskCategory;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskCategoryController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public TaskCategoryController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetTaskCategories()
        {
            var taskCategories = await dbContext.TaskCategories.ToListAsync();
            var taskCategoriesDTO = taskCategories.Select(tc => new TaskCategoryDTO{
                CategoryName = tc.CategoryName,
                TaskCategoryID = tc.TaskCategoryID
            }).ToList();

            return Ok(taskCategoriesDTO);
        }

        [HttpGet("{taskCategoryId}")]
        public async Task<IActionResult> GetTaskCategoryByCategoryID(int taskCategoryId)
        {
            var taskCategory = dbContext.TaskCategories.SingleOrDefault(tc => tc.TaskCategoryID == taskCategoryId);
            
            if(taskCategory == null)
            {
                return NotFound("Category with this id does not exist");
            }

            var taskCategoryDTO = new TaskCategoryDTO 
            { 
                CategoryName = taskCategory.CategoryName,
                TaskCategoryID = taskCategory.TaskCategoryID 
            };

            return Ok(taskCategoryDTO);
        }

        [HttpPut]
        public async Task<IActionResult> AddTaskCategory(AddTaskCategoryRequest addTaskCategoryRequest)
        {
            var taskCategory = new TaskCategory
            {
                CategoryName = addTaskCategoryRequest.TaskCategoryName
            };

            dbContext.TaskCategories.Add(taskCategory);
            await dbContext.SaveChangesAsync();

            var taskCategoryDTO = new TaskCategoryDTO 
            {   
                CategoryName = taskCategory.CategoryName, 
                TaskCategoryID = taskCategory.TaskCategoryID 
            };

            return Ok(taskCategoryDTO);
        }

        [HttpDelete("{taskCategoryId}")]
        public async Task<IActionResult> RemoveTaskCategory(int taskCategoryId)
        {
            var taskCategory = await dbContext.TaskCategories.FindAsync(taskCategoryId);
            if(taskCategory == null)
            {
                return NotFound("This task category does not exist");
            }

            dbContext.TaskCategories.Remove(taskCategory);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
