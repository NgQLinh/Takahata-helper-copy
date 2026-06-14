using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Equipment
{
    public record UpdateMachineRequest(
        long Id,
        string Name,
        MachineType Type,
        string Code,
        string Brand,
        int BitAddress
    );
}
