using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record UpdateDeviceCommand(
        long Id,
        string Name,
        DeviceType Type,
        string SerialNumber,
        string Brand,
        string UpdateBy) : IRequest<ErrorOr<Device>>;
}
