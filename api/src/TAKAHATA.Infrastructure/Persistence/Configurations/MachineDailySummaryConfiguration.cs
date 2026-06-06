using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MachineOperation;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MachineDailySummaryConfiguration : IEntityTypeConfiguration<MachineDailySummary>
    {
        public void Configure(EntityTypeBuilder<MachineDailySummary> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => new { x.MachineId, x.SummaryDate }).IsUnique();
        }
    }
}
