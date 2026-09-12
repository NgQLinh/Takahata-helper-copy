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
        double? ProgrammingTime,
        int ProcessedQuantity,
        string PerformedBy,
        string WorkerNote) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}


