using Barberia.Api.Data;
using Barberia.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberia.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VentasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VentasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ventas
        // Incluye la cita y sus relaciones para mostrar info completa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
        {
            return await _context.Ventas
                .Include(v => v.Cita)
                    .ThenInclude(c => c.Cliente)
                .Include(v => v.Cita)
                    .ThenInclude(c => c.Barbero)
                .Include(v => v.Cita)
                    .ThenInclude(c => c.Servicio)
                .ToListAsync();
        }

        // GET: api/ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVenta(int id)
        {
            var venta = await _context.Ventas
                .Include(v => v.Cita)
                    .ThenInclude(c => c.Cliente)
                .Include(v => v.Cita)
                    .ThenInclude(c => c.Barbero)
                .Include(v => v.Cita)
                    .ThenInclude(c => c.Servicio)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (venta == null)
                return NotFound();

            return venta;
        }

        // POST: api/ventas
        // Body esperado: citaId, monto, fechaHora
        [HttpPost]
        public async Task<ActionResult<Venta>> CreateVenta(Venta venta)
        {
            bool citaOk = await _context.Citas.AnyAsync(c => c.Id == venta.CitaId);
            if (!citaOk)
                return BadRequest("CitaId no existe.");

            if (venta.FechaHora == default)
                venta.FechaHora = DateTime.Now;

            _context.Ventas.Add(venta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVenta), new { id = venta.Id }, venta);
        }

        // PUT: api/ventas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVenta(int id, Venta venta)
        {
            if (id != venta.Id)
                return BadRequest("El id de la URL no coincide con el id del cuerpo.");

            bool citaOk = await _context.Citas.AnyAsync(c => c.Id == venta.CitaId);
            if (!citaOk)
                return BadRequest("CitaId no existe.");

            _context.Entry(venta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                bool exists = await _context.Ventas.AnyAsync(v => v.Id == id);
                if (!exists) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/ventas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var venta = await _context.Ventas.FindAsync(id);

            if (venta == null)
                return NotFound();

            _context.Ventas.Remove(venta);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}