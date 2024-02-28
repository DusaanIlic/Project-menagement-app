using Microsoft.EntityFrameworkCore;
namespace IgracAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Igrac> Igraci => Set<Igrac>();
    }
}
