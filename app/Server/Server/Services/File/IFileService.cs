using Server.Models;

namespace Server.Services.File
{
    public interface IFileService
    {
        public Task PostFileAsync(IFormFile fileData);

        public Task PostMultiFileAsync(List<UploadedFile> fileData);

        public Task DownloadFileById(int fileId);
    }
}