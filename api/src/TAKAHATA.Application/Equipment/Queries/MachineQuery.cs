using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Queries
{
    public record MachineQuery() : IRequest<ErrorOr<IEnumerable<MachineResponse>>>;
}
