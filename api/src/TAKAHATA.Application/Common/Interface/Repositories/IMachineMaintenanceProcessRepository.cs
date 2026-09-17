using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IMachineMaintenanceProcessRepository : IBaseRepository<MachineMaintenanceProcess>
    {
        Task<List<MachineMaintenanceProcess>> GetByMachineIdsAndDateAsync(IEnumerable<int> machineIds, DateTime now);

        Task<SearchResponse<List<MachineMaintenanceProcessResponse>>> SearchAsync(
            List<int>? machineIds,
            List<ProcessStatus>? statuses,
            DateOnly? from,
            DateOnly? to,
            int? page,
            int? pageSize);
    }
}
