using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public record CompleteCommand(
        long MachineId,
        long PartId,
        long ProcessId,
        decimal SetupTime,
        decimal WaitingTime,
        int ProcessedQuantity) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}


