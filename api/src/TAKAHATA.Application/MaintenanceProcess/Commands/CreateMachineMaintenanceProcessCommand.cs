using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.MaintenanceProcess;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public record CreateMachineMaintenanceProcessCommand(
        long MachineId,
        DateOnly PlantDate,
        string? PerformedBy,
        string? Note) : IRequest<ErrorOr<MachineMaintenanceProcessResponse>>;
}
