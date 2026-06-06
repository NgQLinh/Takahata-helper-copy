using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Equipment
{
    public record CreateDeviceRequest(
        string Name,
        MachineType Type,
        string SerialNumber,
        string Brand,
        int BitAddress
    );
}
