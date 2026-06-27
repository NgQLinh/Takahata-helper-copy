using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class IndexConfiguration : IEntityTypeConfiguration<Index>
    {
        public void Configure(EntityTypeBuilder<Index> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .HasIndex(x => x.Code)
                .HasDatabaseName("IX_Index_Code")
                .IsUnique();
        }
    }
}
