using Microsoft.EntityFrameworkCore;
using Pets.Api.Data;

namespace Pets.Api.Endpoints;

public static class AnimalEndpoints
{
  public static RouteGroupBuilder MapAnimalEndpoints(this WebApplication app)
  {
    var group = app.MapGroup("animals");

    group.MapGet("/", async (PetsContext dbContext) => 
      await dbContext.Animals
                      .Select(animal => animal.ToDto())
                      .AsNoTracking()
                      .ToListAsync()
    );

    return group;
  }
}