using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TAKAHATA.Domain.User;

namespace TAKAHATA.Infrastructure.Persistence.Configurations
{
    public class UserMachinePermissionConfiguration : IEntityTypeConfiguration<UserMachinePermission>
    {
        public void Configure(EntityTypeBuilder<UserMachinePermission> builder)
        {
            builder.HasKey(x => x.Guid);

            builder.Property(x => x.UserId)
                .IsRequired()
                .HasMaxLength(450);
        }
    }
}
