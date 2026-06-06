using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MachineScheduleConfiguration : IEntityTypeConfiguration<MachineSchedule>
    {
        public void Configure(EntityTypeBuilder<MachineSchedule> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => new { x.MachineId, x.ScheduleDate });
            builder.Property(x => x.Status).HasConversion<string>();
        }
    }
}
