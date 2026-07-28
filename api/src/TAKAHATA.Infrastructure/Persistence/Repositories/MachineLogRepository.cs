using Microsoft.Extensions.Options;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Domain.DataLog;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineLogRepository : BaseRepository<MachineLog>, IMachineLogRepository
    {
        public MachineLogRepository(AppDbContext dbContext) : base(dbContext)
        {

        }
    }
}
