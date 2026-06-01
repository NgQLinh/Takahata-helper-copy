using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Contracts.Equipment
{
    public record UpdateDeviceRequest(
        long Id,
        string Name,
        DeviceType Type,
        string SerialNumber,
        string Brand
    );
}
