using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class PartConfiguration : IEntityTypeConfiguration<Part>
    {
        public void Configure(EntityTypeBuilder<Part> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .HasIndex(x => x.Code)
                .HasDatabaseName("P_Part_Code")
                .IsUnique();

            builder
                .Property(p => p.CreateAt)
                .IsRequired();

            builder
                .HasMany(x => x.Processes)
                .WithOne(x => x.Part)
                .HasForeignKey(x => x.PartId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
