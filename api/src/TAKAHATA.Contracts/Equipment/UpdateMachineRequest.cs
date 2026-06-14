namespace TAKAHATA.Contracts.Equipment
{
    public record UpdateMachineRequest(
        long Id,
        string Name,
        string Type,
        string Code,
        string Brand,
        int BitAddress
    );
}
