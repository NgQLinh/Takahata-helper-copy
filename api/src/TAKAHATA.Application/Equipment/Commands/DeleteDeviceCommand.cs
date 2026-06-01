using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record DeleteDeviceCommand(long Id) : IRequest<ErrorOr<Device>>;
}
