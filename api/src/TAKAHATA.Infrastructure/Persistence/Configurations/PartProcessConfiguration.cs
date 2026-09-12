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
                .Property(p => p.CreateAt)
                .IsRequired();

            builder
                .HasIndex(x => x.PartId)
                .HasDatabaseName("PS_PartProcess_PartId");

            builder
                .HasIndex(x => x.MachineId)
                .HasDatabaseName("PS_PartProcess_MachineId");

            builder
                .HasIndex(x => x.PlantDate)
                .HasDatabaseName("PS_PartProcess_PlantDate");
        }
    }
}
