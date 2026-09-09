using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public record UpdateMachineMaintenanceProcessCommand(
        int Id,
        int MachineId,
        DateOnly PlantDate,
        DateTime? StartTime,
        DateTime? EndTime,
        string? PerformedBy,
        string? Note,
        double? EstimatedTime,
        ProcessStatus Status = ProcessStatus.Planned) : IRequest<ErrorOr<MachineMaintenanceProcessResponse>>;
}
