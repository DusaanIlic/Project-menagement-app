using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

public class LlmMesage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public string Prompt { get; set; }
    [Required]
    public string Response { get; set; }
    [Required]
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    [Required]
    public int LlmGroupId { get; set; }
    [Required]
    public LlmGroup LlmGroup { get; set; }
}