namespace Pets.Api.Dtos;

public record class PetDetailsDto(
int Id, 
string Name, 
int AnimalId, 
string Breed, 
int Age, 
DateOnly AdoptionDate
);