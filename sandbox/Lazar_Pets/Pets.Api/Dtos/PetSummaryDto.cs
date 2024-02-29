namespace Pets.Api.Dtos;

public record class PetSummaryDto(
int Id, 
string Name, 
string Animal, 
string Breed, 
int Age, 
DateOnly AdoptionDate
);