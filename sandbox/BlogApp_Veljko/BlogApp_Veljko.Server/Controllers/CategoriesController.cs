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
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            _dbContext.Add(category);
            await _dbContext.SaveChangesAsync();

            return Ok(category);
            
        }

        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetAllCategories()
        {
            return Ok(await _dbContext.Categories.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategoryByName(int id)
        {
            var category = await _dbContext.Categories.FindAsync(id);
            if(category == null)
            {
                return BadRequest("Category does not exist!");
            }
            else
            {
                return Ok(category);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Category>> DeleteCategoryByName(int id)
        {
            var category = await _dbContext.Categories.FindAsync(id);

            if(category == null)
            {
                return NotFound();
            }
            
            _dbContext.Remove(category);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
