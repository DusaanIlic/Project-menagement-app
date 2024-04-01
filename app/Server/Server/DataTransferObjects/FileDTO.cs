using System.ComponentModel.DataAnnotations;

namespace Server.DataTransferObjects;

public class FileDTO
{
    [Required]
    public string FileBytes { get; set; }
    [Required]
    public string FileType { get; set; }
    [Required]
    public int UploaderId { get; set; }
}