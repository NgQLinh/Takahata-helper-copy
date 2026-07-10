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
            // chỉ lọc ngày và sắp xếp theo PlanDate.
            builder
                .HasIndex(x => new
                {
                    x.PlanDate,
                    x.Id
                })
                .IsDescending(true, false)
                .HasDatabaseName(
                    "IX_MachineMaintenanceProcess_PlanDate_Id");

            // Trường hợp lọc theo MachineId và khoảng ngày.
            builder
                .HasIndex(x => new
                {
                    x.MachineId,
                    x.PlanDate,
                    x.Id
                })
                .IsDescending(false, true, false)
                .HasDatabaseName(
                    "IX_MachineMaintenanceProcess_MachineId_PlanDate_Id");

            // Trường hợp lọc đồng thời MachineId, Status và ngày.
            builder
                .HasIndex(x => new
                {
                    x.MachineId,
                    x.Status,
                    x.PlanDate,
                    x.Id
                })
                .IsDescending(false, false, true, false)
                .HasDatabaseName(
                    "IX_MachineMaintenanceProcess_MachineId_Status_PlanDate_Id");
        }
    }
}
