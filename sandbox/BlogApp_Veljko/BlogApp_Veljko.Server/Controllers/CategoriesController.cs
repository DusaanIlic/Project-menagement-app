using BlogApp_Veljko.Server.Models.Domain;
using BlogApp_Veljko.Server.Models.DTO;
using BlogApp_Veljko.Server.Repositories.Interface;
using CRUDApp.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace CRUDApp.API.Controllers
{
    //https://localhost:xxxx//api/categories
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
       private readonly ApplicationDbContext _dbContext;
        public CategoriesController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //
        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateCategory(BlogPost bp)
        {
            _dbContext.Add(bp);
            await _dbContext.SaveChangesAsync();

            return Ok(bp);
            
        }

        [HttpGet]
        public async Task<ActionResult<List<BlogPost>>> GetAllCategories()
        {
            return Ok(await _dbContext.BlogPosts.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPostById(int id)
        {
            var bp = await _dbContext.BlogPosts.FindAsync(id);
            if(bp == null)
            {
                return BadRequest("BlogPost does not exist!");
            }
            else
            {
                return Ok(bp);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BlogPost>> DeleteBlogPostById(int id)
        {
            var bp = await _dbContext.BlogPosts.FindAsync(id);

            if(bp == null)
            {
                return NotFound();
            }
            
            _dbContext.Remove(bp);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
