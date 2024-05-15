using Microsoft.Build.Framework;

namespace Server.DataTransferObjects.Request;

public class NotificationDTO
{
    [Required]
    public String Title { get; set; }
    
    [Required]
    public String Description { get; set; }
    
    [Required]
    public DateTime CreatedAt { get; set; }
    
    [Required]
    public bool IsRead { get; set; }
}