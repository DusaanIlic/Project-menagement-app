using Microsoft.EntityFrameworkCore;
using Pets.Api.Data;
using Pets.Api.Dtos;
using Pets.Api.Entities;
using Pets.Api.Mapping;

namespace Pets.Api.Endpoints;

public static class PetsEndpoints
{
  const string GetPetEndpointName = "GetPet";

  public static RouteGroupBuilder MapPetsEndpoints(this WebApplication app)
  {
    var group = app.MapGroup("pets")
    .WithParameterValidation();

    group.MapGet("/", async (PetsContext dbContext) => await dbContext.Pets
      .Include(pet => pet.Animal)
        .Select(pet => pet.ToPetSummaryDto())
          .AsNoTracking()
          .ToListAsync()); 

    group.MapGet("/{id}", async(int id, PetsContext dbContext) => 
    {
      Pet? pet = await dbContext.Pets.FindAsync(id);

      return pet is null ? Results.NotFound() : Results.Ok(pet.ToPetDetailsDto());
    })
    .WithName(GetPetEndpointName);

    group.MapPost("/", async (CreatePetDto newPet, PetsContext dbContext) => 
    {
      Pet pet = newPet.ToEntity();
      
      dbContext.Pets.Add(pet);
      await dbContext.SaveChangesAsync();

      return Results.CreatedAtRoute(GetPetEndpointName, new { id = pet.Id }, pet.ToPetDetailsDto());
    });

    group.MapPut("/{id}", async(int id, UpdatePetDto updatedPet, PetsContext dbContext) => 
    {
      var existingPet = await dbContext.Pets.FindAsync(id);

      if(existingPet is null) 
      {
        return Results.NotFound();
      }
      
      dbContext.Entry(existingPet).CurrentValues.SetValues(updatedPet.ToEntity(id));

      await dbContext.SaveChangesAsync();

      return Results.NoContent();
    })
    .WithParameterValidation();

    group.MapDelete("/{id}", async(int id, PetsContext dbContext) => 
    {
      await dbContext.Pets
                .Where(pet => pet.Id == id)
                .ExecuteDeleteAsync();

      return Results.NoContent();
    });

    return group;
  }
}