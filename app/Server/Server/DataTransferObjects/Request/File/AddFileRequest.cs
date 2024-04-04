using System.ComponentModel.DataAnnotations;
using Server.Attributes;

namespace Server.DataTransferObjects.Request.File;

public class AddFileRequest
{
    [Required]
    [DataType(DataType.Upload)]
    [MaxFileSize(512 * 1024)] // 512KB
    public IFormFile FileDetails { get; set; }
}