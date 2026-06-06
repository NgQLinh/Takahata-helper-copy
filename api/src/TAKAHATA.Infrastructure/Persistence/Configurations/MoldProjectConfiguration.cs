using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MoldManagement;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class MoldProjectConfiguration : IEntityTypeConfiguration<MoldProject>
    {
        public void Configure(EntityTypeBuilder<MoldProject> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ProjectType).HasConversion<string>();
            builder.Property(x => x.Status).HasConversion<string>();
        }
    }
}
