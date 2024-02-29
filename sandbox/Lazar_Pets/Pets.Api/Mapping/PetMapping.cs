using Pets.Api.Dtos;
using Pets.Api.Entities;

namespace Pets.Api.Mapping;

public static class PetMapping
{
  public static Pet ToEntity(this CreatePetDto newPet)
  {
    Pet pet = new()
    {
      Name = newPet.Name,
      AnimalId = newPet.AnimalId,
      Breed = newPet.Breed,
      Age = newPet.Age,
      AdoptionDate = newPet.AdoptionDate
    };
    return pet;
  }
  public static Pet ToEntity(this UpdatePetDto newPet, int id)
  {
    return new()
    {
      Id = id,
      Name = newPet.Name,
      AnimalId = newPet.AnimalId,
      Breed = newPet.Breed,
      Age = newPet.Age,
      AdoptionDate = newPet.AdoptionDate
    };
  }
  public static PetSummaryDto ToPetSummaryDto(this Pet pet)
  {
    return new(
        pet.Id,
        pet.Name,
        pet.Animal!.Name,
        pet.Breed,
        pet.Age,
        pet.AdoptionDate
    );
  }
  public static PetDetailsDto ToPetDetailsDto(this Pet pet)
  {
    return new(
        pet.Id,
        pet.Name,
        pet.AnimalId,
        pet.Breed,
        pet.Age,
        pet.AdoptionDate
    );
  }
}