using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectPriorityController : ControllerBase
    {
        private readonly LogicTenacityDbContext _dbContext;

        public ProjectPriorityController(LogicTenacityDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectPriority>>> GetAllProjectPriority()
        {
            return await _dbContext.ProjectPriorities.ToListAsync();
           
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectPriority>> GetProjectPriorityById(int id)
        {
            var projectPirority = await _dbContext.ProjectPriorities.FindAsync(id);
            if(projectPirority == null)
            {
                return BadRequest(new { message = "Project priority with this id does not exists." });
            }

            return projectPirority;
        }

    }
}
