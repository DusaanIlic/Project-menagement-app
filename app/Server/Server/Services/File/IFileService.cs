using Server.DataTransferObjects;
using Server.Models;

namespace Server.Services.File
{
    public interface IFileService
    {
        public Task PostFileAsync(FileDTO fileData);

        //public Task PostMultiFileAsync(List<FileDTO> fileData);

        public Task<(byte[], string)> GetFileData(int fileId);

        public Task DeleteFile(int fileId);
    }
}