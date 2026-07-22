using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public record StartCommand(long MachineId, long PartId, long ProcessId) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}
