using Server.DataTransferObjects;
using Server.Models;

namespace Server.Services.File
{
    public interface IFileService
    {
        public Task PostFileAsync(UploadedFileDTO fileData);

        public Task PostMultiFileAsync(List<UploadedFileDTO> fileData);

        public Task DownloadFileById(int fileId);
    }
}