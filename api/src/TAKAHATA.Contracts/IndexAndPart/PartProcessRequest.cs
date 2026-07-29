using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public record PartProcessRequest(
        long Id,
        long MachineId,
        DateOnly PlantDate,
        DateTime? StartTime,
        DateTime? EndTime,
        double? WorkingTime,
        double? SetupTime,
        double? WaitingTime,
        string? PerformedBy,
        ProcessStatus Status,
        string Note);
}
