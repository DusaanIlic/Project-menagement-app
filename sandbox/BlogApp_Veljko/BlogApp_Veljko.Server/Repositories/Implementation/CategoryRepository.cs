using BlogApp_Veljko.Server.Models.Domain;
using BlogApp_Veljko.Server.Repositories.Interface;
using CRUDApp.API.Data;

namespace BlogApp_Veljko.Server.Repositories.Implementation
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext dbContext;

        public CategoryRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Category> CreateAsync(Category category)
        {
            await dbContext.Categories.AddAsync(category);
            await dbContext.SaveChangesAsync();

            return category;
        }
    }
}
