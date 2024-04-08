using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices.JavaScript;

namespace Server.Models;

public class IssuedToken
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    [Required]
    public string Token { get; set; }

    [Required] public bool IsBlacklisted { get; set; } = false;
    
    public DateTime ExpiresAt { get; set; }
  
    public int MemberId { get; set; }
    
    
    public Member Member { get; set; }
}