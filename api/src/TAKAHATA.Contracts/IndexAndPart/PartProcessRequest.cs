namespace TAKAHATA.Contracts.IndexAndPart
{
    public record PartProcessRequest(long Id, long MachineId, DateOnly PlanDate, string Note);
}
