using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.DataLog;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MachineLogConfiguration : IEntityTypeConfiguration<MachineLog>
    {
        public void Configure(EntityTypeBuilder<MachineLog> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .Property(p => p.CreateAt)
                .IsRequired();
        }
    }
}
