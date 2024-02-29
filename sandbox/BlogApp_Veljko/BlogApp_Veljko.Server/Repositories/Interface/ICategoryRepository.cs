using BlogApp_Veljko.Server.Models.Domain;

namespace BlogApp_Veljko.Server.Repositories.Interface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateAsync(Category category);
    }
}
