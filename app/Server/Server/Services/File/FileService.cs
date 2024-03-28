using System.Drawing;
using Server.Data;
using Server.DataTransferObjects;
using Server.Models;

namespace Server.Services.File
{
    public class FileService : IFileService
    {
        private readonly LogicTenacityDbContext _dbContextClass;
        private readonly IConfiguration _configuration;

        public FileService(LogicTenacityDbContext dbContextClass, IConfiguration configuration)
        {
            this._dbContextClass = dbContextClass;
            this._configuration = configuration;
        }
        
        public Task PostFileAsync(UploadedFileDTO uploadedFileDto)
        {
            throw new NotImplementedException();
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

