using Pets.Api.Dtos;
using Pets.Api.Entities;

public static class AnimalMapping
{
  public static AnimalDto ToDto(this Animal animal)
  {
    return new AnimalDto(animal.Id, animal.Name);
  }
}