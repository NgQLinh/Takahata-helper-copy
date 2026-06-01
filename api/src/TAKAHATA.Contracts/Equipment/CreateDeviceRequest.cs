using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Contracts.Equipment
{
    public record CreateDeviceRequest(
        string Name,
        DeviceType Type,
        string SerialNumber,
        string Brand
    );
}
