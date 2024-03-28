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
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        
        public FileController(IFileService fileService)
        {
            this._fileService = fileService;
        }

        [HttpPost("Single")]
        public async Task<IActionResult> PostSingleFile(UploadFileRequest uploadFileRequest)
        {
            var idClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (idClaim == null)
            {
                return BadRequest("Member id claim is missing in jwt token");
            }

            FileDTO fileDto = new()
            {
                UploaderId = Int32.Parse(idClaim.Value),
                FileDetails = uploadFileRequest.FileDetails
            };

            await _fileService.PostFileAsync(fileDto);

            return Ok();
        }

        [HttpPost("Multiple")]
        public async Task<IActionResult> PostMultipleFile(List<UploadFileRequest> uploadFileRequests)
        {
            var idClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");

            if (idClaim == null)
            {
                return BadRequest("Member id claim is missing in jwt token");
            }

            List<FileDTO> uploadedFileDTOs = new List<FileDTO>();

            foreach (var uploadFileRequest in uploadFileRequests)
            {
                uploadedFileDTOs.Add(new FileDTO 
                {
                    UploaderId = Int32.Parse(idClaim.Value),
                    FileDetails = uploadFileRequest.FileDetails
                });
            }
            
            await _fileService.PostMultiFileAsync(uploadedFileDTOs);

            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> SendFile(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }
            
            try
            {
                var (fileContent, contentType) = await _fileService.GetFileData(id);
                return File(fileContent, contentType);
            }
            catch (FileNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
    }
}

