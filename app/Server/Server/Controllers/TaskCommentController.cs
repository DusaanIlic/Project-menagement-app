using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TaskCommentsController : ControllerBase
    {
        private readonly LogicTenacityDbContext _context;

        public TaskCommentsController(LogicTenacityDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskComment>>> GetTaskComments()
        {
            return await _context.TaskComments.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskComment>> GetTaskComment(int id)
        {
            var taskComment = await _context.TaskComments.FindAsync(id);

            if (taskComment == null)
            {
                return NotFound();
            }

            return taskComment;
        }

        [HttpGet("task/{taskId}")]
        public async Task<ActionResult<IEnumerable<TaskComment>>> GetTaskCommentsByTaskId(int taskId)
        {
            var taskComments = await _context.TaskComments
                .Where(tc => tc.MemberTaskId == taskId)
                .ToListAsync();

            if (taskComments == null || taskComments.Count == 0)
            {
                return NotFound();
            }

            return taskComments;
        }

        [HttpPost]
        public async Task<ActionResult<TaskComment>> PostTaskComment(TaskComment taskComment)
        {
            taskComment.CreatedAt = DateTime.Now;

            var userClaims = HttpContext.User.Claims;
            var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Id");
            var userIdInt = int.Parse(userId.Value);

            var memberTaskExists = await _context.MemberTasks.AnyAsync(mt => mt.TaskId == taskComment.MemberTaskId && mt.MemberId == userIdInt);
            if (!memberTaskExists)
            {
                return BadRequest("Member is not assigned to the specified task.");
            }

            taskComment.MemberId = userIdInt;

            _context.TaskComments.Add(taskComment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTaskComment", new { id = taskComment.Id }, taskComment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskComment(int id, TaskComment taskComment)
        {
            if (id != taskComment.Id)
            {
                return BadRequest();
            }

            _context.Entry(taskComment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskCommentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Success." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskComment(int id)
        {
            var taskComment = await _context.TaskComments.FindAsync(id);
            if (taskComment == null)
            {
                return NotFound();
            }

            _context.TaskComments.Remove(taskComment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Success." });
        }

        private bool TaskCommentExists(int id)
        {
            return _context.TaskComments.Any(e => e.Id == id);
        }
    }
}
