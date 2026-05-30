using TAKAHATA.Application.Common.Interface.User;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class EquipmentRepository : IEquipmentRepository
    {
        private readonly AppDbContext _dbContext;

        public EquipmentRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
