using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Equipment
{
    public record UpdateDeviceRequest(
        long Id,
        string Name,
        MachineType Type,
        string SerialNumber,
        string Brand,
        int BitAddress
    );
}
