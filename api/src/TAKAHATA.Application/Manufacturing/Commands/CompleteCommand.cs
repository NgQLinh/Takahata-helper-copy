using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public record CompleteCommand(
        long MachineId,
        long PartId,
        long ProcessId,
        double SetupTime,
        double WaitingTime,
        int ProcessedQuantity) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}


