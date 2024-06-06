using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class LlmGroup
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [Required]
    public int MemberId { get; set; }
    [Required]
    public Member Member { get; set; }
    [Required]
    public ICollection<LlmMesage> LlmMesages { get; set; } = new List<LlmMesage>();
}