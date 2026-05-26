using System.ComponentModel.DataAnnotations;

namespace Barberia.Api.Models
{
    public class Barbero
    {
        public int Id { get; set; }

        [Required]
        [StringLength(80, MinimumLength = 2, ErrorMessage = "Nombre inválido.")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Teléfono inválido (10 dígitos).")]
        public string Telefono { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Email inválido.")]
        public string Email { get; set; } = string.Empty;
    }
}