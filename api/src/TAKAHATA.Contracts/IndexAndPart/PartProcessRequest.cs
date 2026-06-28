namespace TAKAHATA.Contracts.IndexAndPart
{
    public record PartProcessRequest(long MachineId, DateOnly PlanDate, string Note);
}
