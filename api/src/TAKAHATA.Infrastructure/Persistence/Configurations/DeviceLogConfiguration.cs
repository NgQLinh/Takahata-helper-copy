using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class DeviceLogConfiguration : IEntityTypeConfiguration<DeviceLog>
    {
        public void Configure(EntityTypeBuilder<DeviceLog> builder)
        {
            builder.ToTable("DEVICE_LOG");

            builder.HasKey(e => e.Id);
        }
    }
}
