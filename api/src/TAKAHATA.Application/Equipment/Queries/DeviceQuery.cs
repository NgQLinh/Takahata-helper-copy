using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Equipment.Queries
{
    public record DeviceQuery() : IRequest<ErrorOr<IEnumerable<Device>>>;
}
