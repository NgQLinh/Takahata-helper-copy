using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record CreateDeviceCommand(
        string Name,
        DeviceType Type,
        string SerialNumber,
        string Brand,
        string CreateBy) : IRequest<ErrorOr<Device>>;
}
