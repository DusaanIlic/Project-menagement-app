using Microsoft.EntityFrameworkCore;

namespace TeamManager.API.Models;

public class TeamManagerContext : DbContext
{
    public TeamManagerContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Member> Members { get; set; } = null!;
}