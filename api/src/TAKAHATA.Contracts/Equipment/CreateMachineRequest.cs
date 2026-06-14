using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Equipment
{
    public record CreateMachineRequest(
        string Name,
        string Type,
        string Code,
        string Brand,
        int BitAddress
    );
}
