using System;

namespace Barberia.Api.Models
{
    public class Venta
    {
        public int Id { get; set; }

        public int CitaId { get; set; }
        public decimal Monto { get; set; }
        public DateTime FechaHora { get; set; }

        // Navegación
        public Cita? Cita { get; set; }
    }
}