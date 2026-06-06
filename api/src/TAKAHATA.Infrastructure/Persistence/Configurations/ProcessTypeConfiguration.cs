using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class ProcessTypeConfiguration : IEntityTypeConfiguration<ProcessType>
    {
        public void Configure(EntityTypeBuilder<ProcessType> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => x.Code).IsUnique();
        }
    }
}
