using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class UploadedFile
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FileId { get; set; }
        
        [Key]
        [Required(ErrorMessage = "File path is required.")]
        public string FilePath { get; set; }
        
        public int UploaderId { get; set; }
        [ForeignKey("MemberId")]
        public Member Uploader { get; set; }
    }
}