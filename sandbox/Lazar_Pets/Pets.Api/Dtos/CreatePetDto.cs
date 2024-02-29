using System.ComponentModel.DataAnnotations;

namespace Pets.Api.Dtos;

public record class CreatePetDto(
[Required][StringLength(50)]string Name, 
int AnimalId, 
[Required][StringLength(20)]string Breed, 
[Required][Range(1, 50)]int Age,
[Required]DateOnly AdoptionDate
);