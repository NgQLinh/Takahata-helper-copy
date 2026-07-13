using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public record PartProcessRequest(
        long Id,
        long MachineId,
        DateOnly PlantDate,
        DateOnly? ActualDate,
        ProcessStatus Status,
        decimal? WorkingHours,
        string Note);
}
