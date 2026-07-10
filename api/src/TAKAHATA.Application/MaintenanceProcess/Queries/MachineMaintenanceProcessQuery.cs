using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public record MachineMaintenanceProcessQuery(long Id) : IRequest<ErrorOr<MachineMaintenanceProcessResponse>>;
}
