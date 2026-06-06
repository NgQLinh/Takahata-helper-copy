using ErrorOr;
using MediatR;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Queries
{
    public record DeviceQuery() : IRequest<ErrorOr<IEnumerable<Machine>>>;
}
