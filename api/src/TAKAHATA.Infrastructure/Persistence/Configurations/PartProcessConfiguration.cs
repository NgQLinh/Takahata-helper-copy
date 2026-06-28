using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class PartProcessConfiguration : IEntityTypeConfiguration<PartProcess>
    {
        public void Configure(EntityTypeBuilder<PartProcess> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .HasIndex(x => x.PartId)
                .HasDatabaseName("PS_Index_PartId");

            builder
                .Property(p => p.CreateAt)
                .IsRequired();

            builder
                .HasIndex(x => x.MachineId)
                .HasDatabaseName("PS_Index_MachineId");
        }
    }
}
