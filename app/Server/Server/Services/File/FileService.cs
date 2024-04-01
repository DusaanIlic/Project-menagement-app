using System.Drawing;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.File;
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
        
        public async Task PostFileAsync(int uploaderId, AddFileRequest addFileRequest)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(addFileRequest.FileDetails.FileName);
            var filePath = Path.Combine(_configuration["FileService:StoragePath"], fileName);

            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await addFileRequest.FileDetails.CopyToAsync(stream);
            }

            var uploadedFile = new Models.File
            {
                FilePath = filePath,
                UploaderId = uploaderId
            };

            _dbContext.Files.Add(uploadedFile);

            await _dbContext.SaveChangesAsync();
        }

        public async Task PostMultiFileAsync(int uploaderId, List<AddFileRequest> fileDatas)
        {
            foreach (var fileData in fileDatas)
            {
                await PostFileAsync(uploaderId, fileData);
            }
        }

        public async Task<FileDTO> GetFileData(int fileId)
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

            var fileContentBytes = System.IO.File.ReadAllBytes(file.FilePath);
            var fileExtension = Path.GetExtension(file.FilePath);
            var contentType = GetContentType(fileExtension);

            var fileDTO = new FileDTO()
            {
                FileBytes = Convert.ToBase64String(fileContentBytes),
                FileType = contentType,
                UploaderId = file.UploaderId
            };
            
            return fileDTO;
        }

        public async Task DeleteFile(int fileId)
        {
            var file = await _dbContext.Files.FindAsync(fileId);
            
            System.IO.File.Delete(file.FilePath);
            
            _dbContext.Remove(file);
            await _dbContext.SaveChangesAsync();
        }


        public static string GetContentType(String fileExtension)
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

