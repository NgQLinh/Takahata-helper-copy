using ErrorOr;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.MaintenanceProcess
{
    public interface IMachineMaintenanceProcessRepository
    {
        Task<MachineMaintenanceProcess?> AddAsync(MachineMaintenanceProcess machineMaintenanceProcess);
        Task<MachineMaintenanceProcess?> DeleteMachineByIdAsync(long id);
        Task<SearchResponse<List<MachineMaintenanceProcessResponse>>> SearchAsync(
            List<long>? machineIds,
            List<ProcessStatus>? statuses,
            DateOnly? from,
            DateOnly? to,
            int? page,
            int? pageSize);
    }
}
