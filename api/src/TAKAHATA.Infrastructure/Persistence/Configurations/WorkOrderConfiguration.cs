using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class WorkOrderConfiguration : IEntityTypeConfiguration<WorkOrder>
    {
        public void Configure(EntityTypeBuilder<WorkOrder> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => x.WorkOrderCode);
            builder.Property(x => x.Status).HasConversion<string>();
        }
    }
}
