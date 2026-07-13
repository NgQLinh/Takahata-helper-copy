using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public record PartProcessRequest(long Id, long MachineId, DateOnly PlanDate, DateOnly ActualDate, ProcessStatus Status, string Note);
}
