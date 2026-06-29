namespace TAKAHATA.Contracts.IndexAndPart
{
    public class PartProcessResponse
    {
        public long PartId { get; set; }
        public int Sequence { get; set; }
        public long MachineId { get; set; }
        public DateOnly? PlanDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public decimal? WorkingHours { get; set; }
        public bool IsCompleted { get; set; }
        public string Note { get; set; } = string.Empty;
        public MachineResponse? Machine { get; set; }
    }
}
