using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.Equipments;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class EquipmentConfiguration : IEntityTypeConfiguration<Equipment>
    {
        public void Configure(EntityTypeBuilder<Equipment> builder)
        {
            builder.ToTable("EQUIPMENT");

            builder.HasKey(e => e.Id);
        }
    }
}
