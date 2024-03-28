namespace Server.Services.File
{
    public interface IFileService
    {
        public Task PostFileAsync(IFormFile fileData);

        public Task PostMultiFileAsync(List<Models.UploadedFile> fileData);
    }
}