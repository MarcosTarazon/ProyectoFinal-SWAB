using Barberia.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Barberia.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Servicio> Servicios { get; set; }
        public DbSet<Barbero> Barberos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<Venta> Ventas { get; set; }
    }
}