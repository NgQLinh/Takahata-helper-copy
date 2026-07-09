using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MachineMaintenanceProcessConfiguration : IEntityTypeConfiguration<MachineMaintenanceProcess>
    {
        public void Configure(EntityTypeBuilder<MachineMaintenanceProcess> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .Property(p => p.CreateAt)
                .IsRequired();

            builder
                .HasIndex(x => x.MachineId)
                .HasDatabaseName("PS_MachineMaintenanceProcess_MachineId");
        }
    }
}
