using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.MaintenanceProcess
{
    public interface IMachineMaintenanceProcessRepository
    {
        Task<MachineMaintenanceProcess?> AddAsync(MachineMaintenanceProcess machineMaintenanceProcess);
        Task<SearchResponse<MachineMaintenanceProcess>> SearchAsync(
            List<long>? machineIds,
            DateOnly? from,
            DateOnly? to,
            int? page,
            int? pageSize);
    }
}
