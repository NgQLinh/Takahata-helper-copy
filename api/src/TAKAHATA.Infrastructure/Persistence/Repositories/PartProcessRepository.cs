using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class PartProcessRepository : BaseRepository<PartProcess>, IPartProcessRepository
    {
        public PartProcessRepository(
            AppDbContext dbContext,
            IMapper mapper) : base(dbContext)
        {

        }

        public async Task<IEnumerable<PartProcess>> GetByMachineIdAsync(long machineId)
        {
            return await _dbContext.PartProcesses
                .Where(p => p.MachineId == machineId)
                .ToListAsync();
        }
    }
}
