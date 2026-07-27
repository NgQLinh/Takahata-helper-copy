using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MachineConfiguration : IEntityTypeConfiguration<Machine>
    {
        public void Configure(EntityTypeBuilder<Machine> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .HasIndex(x => x.Name)
                .IsUnique();

            builder
                .HasIndex(x => x.Code)
                .IsUnique();

            builder
                .Property(p => p.CreateAt)
                .IsRequired();

            builder
                .HasMany(x => x.MachineMaintenanceProcesses)
                .WithOne(x => x.Machine)
                .HasForeignKey(x => x.MachineId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
