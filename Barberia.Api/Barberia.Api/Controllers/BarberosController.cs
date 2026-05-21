using Barberia.Api.Data;
using Barberia.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarberosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BarberosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/barberos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Barbero>>> GetBarberos()
        {
            return await _context.Barberos.ToListAsync();
        }

        // GET: api/barberos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Barbero>> GetBarbero(int id)
        {
            var barbero = await _context.Barberos.FindAsync(id);

            if (barbero == null)
                return NotFound();

            return barbero;
        }

        // POST: api/barberos
        [HttpPost]
        public async Task<ActionResult<Barbero>> CreateBarbero(Barbero barbero)
        {
            _context.Barberos.Add(barbero);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBarbero), new { id = barbero.Id }, barbero);
        }

        // PUT: api/barberos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBarbero(int id, Barbero barbero)
        {
            if (id != barbero.Id)
                return BadRequest("El id de la URL no coincide con el id del cuerpo.");

            _context.Entry(barbero).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                bool exists = await _context.Barberos.AnyAsync(b => b.Id == id);
                if (!exists) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/barberos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBarbero(int id)
        {
            var barbero = await _context.Barberos.FindAsync(id);

            if (barbero == null)
                return NotFound();

            _context.Barberos.Remove(barbero);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}