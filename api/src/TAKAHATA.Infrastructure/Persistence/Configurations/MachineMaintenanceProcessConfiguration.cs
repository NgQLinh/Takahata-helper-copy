using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MachineMaintenanceProcessConfiguration : IEntityTypeConfiguration<MachineMaintenanceProcess>
    {
        public void Configure(EntityTypeBuilder<MachineMaintenanceProcess> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .Property(p => p.CreateAt)
                .IsRequired();

            // Trường hợp không lọc machine/status,
            // chỉ lọc ngày và sắp xếp theo PlantDate.
            builder
                .HasIndex(x => new
                {
                    x.PlantDate,
                    x.Id
                })
                .IsDescending(true, false)
                .HasDatabaseName(
                    "IX_MachineMaintenanceProcess_PlantDate_Id");

            // Trường hợp lọc theo MachineId và khoảng ngày.
            builder
                .HasIndex(x => new
                {
                    x.MachineId,
                    x.PlantDate,
                    x.Id
                })
                .IsDescending(false, true, false)
                .HasDatabaseName(
                    "IX_MachineMaintenanceProcess_MachineId_PlantDate_Id");

            // Trường hợp lọc đồng thời MachineId, Status và ngày.
            builder
                .HasIndex(x => new
                {
                    x.MachineId,
                    x.Status,
                    x.PlantDate,
                    x.Id
                })
                .IsDescending(false, false, true, false)
                .HasDatabaseName(
                    "IX_MachineMaintenanceProcess_MachineId_Status_PlantDate_Id");
        }
    }
}
