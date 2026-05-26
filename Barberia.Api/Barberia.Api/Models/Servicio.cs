using System.ComponentModel.DataAnnotations;

namespace Barberia.Api.Models
{
    public class Servicio
    {
        public int Id { get; set; }

        [Required]
        [StringLength(80, MinimumLength = 2, ErrorMessage = "Nombre inválido.")]
        public string Nombre { get; set; } = string.Empty;

        [Range(1, 999999, ErrorMessage = "Precio inválido (debe ser mayor a 0).")]
        public decimal Precio { get; set; }

        [Range(1, 600, ErrorMessage = "Duración inválida (1 a 600 minutos).")]
        public int DuracionMin { get; set; }
    }
}