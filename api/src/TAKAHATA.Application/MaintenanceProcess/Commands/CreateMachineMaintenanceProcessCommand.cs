using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public record CreateMachineMaintenanceProcessCommand(
        long MachineId,
        DateOnly PlanDate,
        DateOnly? ActualDate,
        decimal WorkingHours,
        string? PerformedBy,
        string? Note,
        ProcessStatus Status = ProcessStatus.Planned) : IRequest<ErrorOr<MachineMaintenanceProcessResponse>>;
}
