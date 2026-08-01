using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public record CompleteCommand(
        int MachineId,
        int PartId,
        int ProcessId,
        double SetupTime,
        double WaitingTime,
        int ProcessedQuantity,
        string PerformedBy) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}


