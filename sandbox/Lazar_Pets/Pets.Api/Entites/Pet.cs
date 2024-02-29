namespace Pets.Api.Entities;

public class Pet
{
  public int Id { get; set; }

  public required string Name { get;set; }

  public int AnimalId { get;set; }

  public Animal? Animal { get;set; }

  public required string Breed { get;set; }

  public required int Age { get;set; }

  public required DateOnly AdoptionDate { get;set; }
}