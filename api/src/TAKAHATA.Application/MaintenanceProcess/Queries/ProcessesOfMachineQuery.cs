using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public record ProcessesOfMachineQuery(
        int MachineId,
        int? Page,
        int? PageSize) : IRequest<ErrorOr<SearchResponse<List<ManufacturingProcessResponse>>>>;
}
