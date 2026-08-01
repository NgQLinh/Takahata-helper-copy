using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public record MachineMaintenanceProcessesQuery(
        List<int>? MachineIds,
        List<ProcessStatus>? Statuses,
        DateOnly? From,
        DateOnly? To,
        int? Page,
        int? PageSize) : IRequest<ErrorOr<SearchResponse<List<MachineMaintenanceProcessResponse>>>>;
}
