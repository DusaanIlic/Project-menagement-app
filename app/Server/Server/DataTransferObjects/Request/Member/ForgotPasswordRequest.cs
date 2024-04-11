using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects.Request.Member;

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } 
}