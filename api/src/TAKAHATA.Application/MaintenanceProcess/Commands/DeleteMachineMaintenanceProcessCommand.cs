using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.MaintenanceProcess;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public record DeleteMachineMaintenanceProcessCommand(int Id) : IRequest<ErrorOr<MachineMaintenanceProcessResponse>>;
}
