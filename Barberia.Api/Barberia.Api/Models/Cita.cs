using System;

namespace Barberia.Api.Models
{
    public class Cita
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }
        public int BarberoId { get; set; }
        public int ServicioId { get; set; }

        public DateTime FechaHora { get; set; }

        // "Pendiente", "Confirmada", "Completada", "Cancelada"
        public string Estado { get; set; } = "Pendiente";

        // Navegación (para relaciones)
        public Cliente? Cliente { get; set; }
        public Barbero? Barbero { get; set; }
        public Servicio? Servicio { get; set; }
    }
}