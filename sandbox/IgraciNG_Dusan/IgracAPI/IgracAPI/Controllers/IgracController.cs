using IgracAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IgracAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IgracController : ControllerBase
    {
        private readonly DataContext _context;
        public IgracController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Igrac>>> GetIgraci()
        {
            return Ok(await _context.Igraci.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<List<Igrac>>> CreateIgrac(Igrac igrac)
        {
            _context.Igraci.Add(igrac);
            await _context.SaveChangesAsync();

            return Ok(await _context.Igraci.ToListAsync());
        }

        [HttpPut]
        public async Task<ActionResult<List<Igrac>>> UpdateIgrac(Igrac igrac)
        {
            var dbIgrac = await _context.Igraci.FindAsync(igrac.Id);
            if(dbIgrac == null)
            {
                return BadRequest("Igrac ne postoji");
            }

            dbIgrac.Ime = igrac.Ime;
            dbIgrac.Prezime = igrac.Prezime;
            dbIgrac.Klub = igrac.Klub;

            await _context.SaveChangesAsync();

            return Ok(await _context.Igraci.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Igrac>>> DeleteIgrac(int id)
        {
            var dbIgrac = await _context.Igraci.FindAsync(id);
            if (dbIgrac == null)
            {
                return BadRequest("Igrac ne postoji");
            }

            _context.Igraci.Remove(dbIgrac);
            await _context.SaveChangesAsync();

            return Ok(await _context.Igraci.ToListAsync());
        }
    }
}
