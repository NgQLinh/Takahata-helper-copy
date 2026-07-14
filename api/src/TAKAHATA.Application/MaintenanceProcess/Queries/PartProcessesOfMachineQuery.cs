using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public record PartProcessesOfMachineQuery(long MachineId) : IRequest<ErrorOr<IEnumerable<PartProcessResponse>>>;
}
