using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.Equipments;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class EquipmentLogConfiguration : IEntityTypeConfiguration<EquipmentLog>
    {
        public void Configure(EntityTypeBuilder<EquipmentLog> builder)
        {
            builder.ToTable("EQUIPMENT_LOG");

            builder.HasKey(e => e.Id);
        }
    }
}
