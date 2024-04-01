using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects.Request.File;

public class AddFileRequest
{
    [Required]
    public IFormFile FileDetails { get; set; }
}