using Barberia.Api.Data;
using Barberia.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CitasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/citas
        // Incluye Cliente, Barbero y Servicio para que React no tenga que “adivinar”
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cita>>> GetCitas()
        {
            return await _context.Citas
                .Include(c => c.Cliente)
                .Include(c => c.Barbero)
                .Include(c => c.Servicio)
                .ToListAsync();
        }

        // GET: api/citas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cita>> GetCita(int id)
        {
            var cita = await _context.Citas
                .Include(c => c.Cliente)
                .Include(c => c.Barbero)
                .Include(c => c.Servicio)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cita == null)
                return NotFound();

            return cita;
        }

        // POST: api/citas
        // Body esperado: clienteId, barberoId, servicioId, fechaHora, estado
        [HttpPost]
        public async Task<ActionResult<Cita>> CreateCita(Cita cita)
        {
            // Validación mínima para evitar claves foráneas inválidas
            bool clienteOk = await _context.Clientes.AnyAsync(x => x.Id == cita.ClienteId);
            bool barberoOk = await _context.Barberos.AnyAsync(x => x.Id == cita.BarberoId);
            bool servicioOk = await _context.Servicios.AnyAsync(x => x.Id == cita.ServicioId);

            if (!clienteOk || !barberoOk || !servicioOk)
                return BadRequest("ClienteId, BarberoId o ServicioId no existen.");

            if (string.IsNullOrWhiteSpace(cita.Estado))
                cita.Estado = "Pendiente";

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCita), new { id = cita.Id }, cita);
        }

        // PUT: api/citas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCita(int id, Cita cita)
        {
            if (id != cita.Id)
                return BadRequest("El id de la URL no coincide con el id del cuerpo.");

            bool clienteOk = await _context.Clientes.AnyAsync(x => x.Id == cita.ClienteId);
            bool barberoOk = await _context.Barberos.AnyAsync(x => x.Id == cita.BarberoId);
            bool servicioOk = await _context.Servicios.AnyAsync(x => x.Id == cita.ServicioId);

            if (!clienteOk || !barberoOk || !servicioOk)
                return BadRequest("ClienteId, BarberoId o ServicioId no existen.");

            _context.Entry(cita).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                bool exists = await _context.Citas.AnyAsync(c => c.Id == id);
                if (!exists) return NotFound();
                throw;
            }

            return NoContent();
        }

        // PATCH: api/citas/5/estado
        // Cambia solo el estado (más práctico para el módulo)
        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> UpdateEstado(int id, [FromBody] string estado)
        {
            var cita = await _context.Citas.FindAsync(id);
            if (cita == null) return NotFound();

            if (string.IsNullOrWhiteSpace(estado))
                return BadRequest("Estado inválido.");

            cita.Estado = estado.Trim();
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/citas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCita(int id)
        {
            var cita = await _context.Citas.FindAsync(id);

            if (cita == null)
                return NotFound();

            _context.Citas.Remove(cita);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}