using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MachineOperation;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MachineOperationLogConfiguration : IEntityTypeConfiguration<MachineOperationLog>
    {
        public void Configure(EntityTypeBuilder<MachineOperationLog> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => new { x.MachineId, x.LogTime });
            builder.Property(x => x.MachineStatus).HasConversion<string>();
        }
    }
}
