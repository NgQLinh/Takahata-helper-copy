using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public record PauseCommand(
        int MachineId,
        int PartId,
        int ProcessId,
        double SetupTime,
        double WaitingTime,
        double? ProgrammingTime,
        int ProcessedQuantity,
        string PerformedBy,
        double? MachineTime,
        string? WorkerNote) : IRequest<ErrorOr<ManufacturingProcessResponse>>;
}
