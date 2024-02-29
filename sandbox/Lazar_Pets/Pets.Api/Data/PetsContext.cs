using Microsoft.EntityFrameworkCore;
using Pets.Api.Entities;

namespace Pets.Api.Data;

public class PetsContext(DbContextOptions<PetsContext> options) : DbContext(options)
{
  public DbSet<Pet> Pets => Set<Pet>();

  public DbSet<Animal> Animals => Set<Animal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Animal>().HasData(
          new {Id=1, Name = "Dog"},
          new {Id = 2, Name = "Cat"},
          new {Id=3, Name="Turtle"}
        );
    }
}