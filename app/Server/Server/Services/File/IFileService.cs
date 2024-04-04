using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.File;
using Server.Models;

namespace Server.Services.File
{
    public interface IFileService
    {
        public Task<Models.File> PostFileAsync(int uploaderId, AddFileRequest fileData);

        // public Task PostMultiFileAsync(int uploaderId, List<AddFileRequest> fileData);

        public Task<(byte[], string)> GetFileData(int fileId);

        public Task DeleteFile(int fileId);
    }
}