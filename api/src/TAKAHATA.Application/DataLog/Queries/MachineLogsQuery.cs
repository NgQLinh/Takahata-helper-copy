using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.DataLog.Queries
{
    public record MachineLogsQuery(List<long> MachineIds) : IRequest<ErrorOr<IEnumerable<MachineLogResponse>>>;
}
