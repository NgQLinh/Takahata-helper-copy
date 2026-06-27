using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Domain.User;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Infrastructure.Persistence
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Machine> Machines { get; set; }
        public DbSet<Index> Indexes { get; set; }
        public DbSet<Part> Partes { get; set; }
        public DbSet<PartProcess> PartProcesses { get; set; }

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
