using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.Equipment.Queries
{
    public record MachineQuery() : IRequest<ErrorOr<IEnumerable<MachineResponse>>>;
}
