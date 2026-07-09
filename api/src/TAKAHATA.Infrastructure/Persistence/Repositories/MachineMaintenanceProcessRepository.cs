using TAKAHATA.Application.Common.Interface.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineMaintenanceProcessRepository : IMachineMaintenanceProcessRepository
    {

        private readonly AppDbContext _dbContext;

        public MachineMaintenanceProcessRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MachineMaintenanceProcess?> AddAsync(MachineMaintenanceProcess machineMaintenanceProcess)
        {
            await _dbContext.MachineMaintenanceProcesses.AddAsync(machineMaintenanceProcess);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? machineMaintenanceProcess : null;
        }
    }
}
