using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public record PauseCommand(int MachineId, int PartId, int ProcessId) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}
