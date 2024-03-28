using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class UploadedFile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FileId { get; set; }
        
        [Required(ErrorMessage = "File path is required.")]
        public string FilePath { get; set; }
        
        public int UploaderId { get; set; }
        public Member Uploader { get; set; }
    }
}