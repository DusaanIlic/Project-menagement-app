using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.DataTransferObjects;
using Server.DataTransferObjects.Request.UploadedFile;
using Server.Models;
using Server.Services.File;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UploadedFileController : ControllerBase
    {
        private readonly IFileService _fileService;
        
        public UploadedFileController(IFileService fileService)
        {
            this._fileService = fileService;
        }

        [HttpPost]
        public async Task<IActionResult> PostSingleFile(UploadFileRequest uploadFileRequest)
        {
            var idClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (idClaim == null)
            {
                return BadRequest("Member id claim is missing in jwt token");
            }

            UploadedFileDTO uploadedFileDto = new()
            {
                UploaderId = Int32.Parse(idClaim.Value),
                FileDetails = uploadFileRequest.FileDetails
            };

            await _fileService.PostFileAsync(uploadedFileDto);

            return Ok();
        }
    }
}

