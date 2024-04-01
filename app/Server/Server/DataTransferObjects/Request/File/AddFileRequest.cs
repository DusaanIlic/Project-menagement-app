using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects.Request.File;

public class AddFileRequest
{
    [Required]
    [DataType(DataType.Upload)]
    public IFormFile FileDetails { get; set; }
}