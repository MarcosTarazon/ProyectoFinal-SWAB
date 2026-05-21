using Barberia.Api.Data;
using Barberia.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiciosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/servicios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Servicio>>> GetServicios()
        {
            return await _context.Servicios.ToListAsync();
        }

        // GET: api/servicios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Servicio>> GetServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);

            if (servicio == null)
                return NotFound();

            return servicio;
        }

        // POST: api/servicios
        [HttpPost]
        public async Task<ActionResult<Servicio>> CreateServicio(Servicio servicio)
        {
            _context.Servicios.Add(servicio);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServicio), new { id = servicio.Id }, servicio);
        }

        // PUT: api/servicios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServicio(int id, Servicio servicio)
        {
            if (id != servicio.Id)
                return BadRequest("El id de la URL no coincide con el id del cuerpo.");

            _context.Entry(servicio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                bool exists = await _context.Servicios.AnyAsync(s => s.Id == id);
                if (!exists) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/servicios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);

            if (servicio == null)
                return NotFound();

            _context.Servicios.Remove(servicio);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}