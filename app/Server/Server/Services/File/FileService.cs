using System.Drawing;
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
        
        public async Task PostFileAsync(UploadedFileDTO uploadedFileDto)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadedFileDto.FileDetails.FileName);
            var filePath = Path.Combine(_configuration["FileService:StoragePath"], fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadedFileDto.FileDetails.CopyToAsync(stream);
            }

            var uploadedFile = new UploadedFile
            {
                FilePath = filePath,
                UploaderId = uploadedFileDto.MemberId
            };

            _dbContext.UploadedFiles.Add(uploadedFile);

            await _dbContext.SaveChangesAsync();
        }

        public Task PostMultiFileAsync(List<UploadedFileDTO> fileData)
        {
            throw new NotImplementedException();
        }

        public Task DownloadFileById(int fileId)
        {
            throw new NotImplementedException();
        }
    }
}

