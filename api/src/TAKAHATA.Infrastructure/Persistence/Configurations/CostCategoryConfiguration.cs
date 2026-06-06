using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.CostManagement;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class CostCategoryConfiguration : IEntityTypeConfiguration<CostCategory>
    {
        public void Configure(EntityTypeBuilder<CostCategory> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasIndex(x => x.Code).IsUnique();
        }
    }
}
