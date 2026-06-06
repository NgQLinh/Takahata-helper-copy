using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MoldManagement;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MoldPartConfiguration : IEntityTypeConfiguration<MoldPart>
    {
        public void Configure(EntityTypeBuilder<MoldPart> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => new { x.ProjectId, x.PartCode });
            builder.Property(x => x.Status).HasConversion<string>();
        }
    }
}
