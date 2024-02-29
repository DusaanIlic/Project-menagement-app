using System.ComponentModel.DataAnnotations;

namespace TeamManager.API.Models;

public class Member
{
    public long Id { get; set; }
    [MaxLength(32)]
    public string? FirstName { get; set; }
    [MaxLength(32)]
    public string? LastName { get; set; }
    [MaxLength(255)]
    public string? JobDescription { get; set; }
    public float Salary { get; set; }
}