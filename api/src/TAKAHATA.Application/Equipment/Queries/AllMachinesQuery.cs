using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.Equipment.Queries
{
    public record AllMachinesQuery() : IRequest<ErrorOr<IEnumerable<MachineResponse>>>;
}
