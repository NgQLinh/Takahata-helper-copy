using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.MaintenanceProcess;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public record MachineMaintenanceProcessQuery(int Id) : IRequest<ErrorOr<MachineMaintenanceProcessResponse>>;
}
