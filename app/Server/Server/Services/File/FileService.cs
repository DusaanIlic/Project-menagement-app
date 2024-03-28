using System.Drawing;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;

namespace Server.Services.File
{
    public class FileService : IFileService
    {
        private readonly LogicTenacityDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public FileService(LogicTenacityDbContext dbContextClass, IConfiguration configuration)
        {
            _dbContext = dbContextClass;
            _configuration = configuration;
        }
        
        public async Task PostFileAsync(FileDTO fileDto)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(fileDto.FileDetails.FileName);
            var filePath = Path.Combine(_configuration["FileService:StoragePath"], fileName);

            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await fileDto.FileDetails.CopyToAsync(stream);
            }

            var uploadedFile = new Models.File
            {
                FilePath = filePath,
                UploaderId = fileDto.UploaderId
            };

            _dbContext.Files.Add(uploadedFile);

            await _dbContext.SaveChangesAsync();
        }

        public async Task PostMultiFileAsync(List<FileDTO> fileDatas)
        {
            foreach (var fileData in fileDatas)
            {
                await PostFileAsync(fileData);
            }
        }

        public async Task<(byte[], string)> GetFileData(int fileId)
        {
            var file = await _dbContext.Files.FindAsync(fileId);

            if (file == null)
            {
                throw new FileNotFoundException("File not found.");
            }

            if (!System.IO.File.Exists(file.FilePath))
            {
                throw new FileNotFoundException("File not found on disk.");
            }

            byte[] fileContentBytes;
            string contentType;

            // Read file content
            using (FileStream fs = new FileStream(file.FilePath, FileMode.Open, FileAccess.Read))
            {
                using (BinaryReader br = new BinaryReader(fs))
                {
                    fileContentBytes = br.ReadBytes((int)fs.Length);
                }
            }

            // Determine content type based on file extension
            string fileExtension = Path.GetExtension(file.FilePath);
            contentType = GetContentType(fileExtension);

            return (fileContentBytes, contentType);
        }

        public string GetContentType(String fileExtension)
        {
            String contentType;
            
            switch (fileExtension.ToLowerInvariant())
            {
                case ".txt":
                    contentType = "text/plain";
                    break;
                case ".pdf":
                    contentType = "application/pdf";
                    break;
                case ".doc":
                case ".docx":
                    contentType = "application/msword";
                    break;
                case ".xls":
                case ".xlsx":
                    contentType = "application/vnd.ms-excel";
                    break;
                case ".png":
                    contentType = "image/png";
                    break;
                case ".jpg":
                case ".jpeg":
                    contentType = "image/jpeg";
                    break;
                case ".gif":
                    contentType = "image/gif";
                    break;
                default:
                    contentType = "application/octet-stream"; // Default content type
                    break;
            }

            return contentType;
        }
    }
}

