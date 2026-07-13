using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public record PartProcessRequest(long Id, long MachineId, DateOnly PlanDate, ProcessStatus Status, string Note);
}
