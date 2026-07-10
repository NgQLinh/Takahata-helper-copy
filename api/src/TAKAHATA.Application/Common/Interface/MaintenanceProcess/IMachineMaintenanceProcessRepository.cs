using ErrorOr;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.MaintenanceProcess
{
    public interface IMachineMaintenanceProcessRepository : IBaseRepository<MachineMaintenanceProcess>
    {
        Task<SearchResponse<List<MachineMaintenanceProcessResponse>>> SearchAsync(
            List<long>? machineIds,
            List<ProcessStatus>? statuses,
            DateOnly? from,
            DateOnly? to,
            int? page,
            int? pageSize);
    }
}
