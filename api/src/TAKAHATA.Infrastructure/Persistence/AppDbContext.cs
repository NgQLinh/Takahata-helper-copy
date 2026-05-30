using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Domain.Equipment;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Infrastructure.Persistence
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceLog> DeviceLogs { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            base.OnModelCreating(builder);
            // Customize the identity model if needed
        }
    }
}
