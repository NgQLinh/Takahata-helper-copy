using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public record MachineMaintenanceProcessQuery(
        List<long>? MachineIds,
        DateOnly? From,
        DateOnly? To,
        int? Page,
        int? PageSize) : IRequest<ErrorOr<SearchResponse<MachineMaintenanceProcess>>>;
}
