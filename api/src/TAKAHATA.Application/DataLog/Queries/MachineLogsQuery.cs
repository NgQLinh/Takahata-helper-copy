using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.DataLog.Queries
{
    public record MachineLogsQuery(List<int> MachineIds) : IRequest<ErrorOr<IEnumerable<MachineLogResponse>>>;
}
