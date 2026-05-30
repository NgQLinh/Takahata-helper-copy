using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record CreateDeviceCommand : IRequest<ErrorOr<Device>>
    {
        public string Name { get; set; } = string.Empty;
        public DeviceType Type { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string CreateBy { get; set; } = string.Empty;
    }
}
