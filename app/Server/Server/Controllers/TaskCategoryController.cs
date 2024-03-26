using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.DataTransferObjects.Request.ProjectStatus;
using Server.DataTransferObjects;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskCategoryController : ControllerBase
    {
        private readonly LogicTenacityDbContext dbContext;

        public TaskCategoryController(LogicTenacityDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
    }
}
