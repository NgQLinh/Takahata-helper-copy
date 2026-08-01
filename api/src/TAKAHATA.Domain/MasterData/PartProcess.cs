namespace TAKAHATA.Domain.MasterData
{
    public class PartProcess : Process
    {
        public int PartId { get; set; }
        public int Sequence { get; set; }
        public double? WorkingTime { get; set; }
        public double? SetupTime { get; set; }
        public double? WaitingTime { get; set; }
        public int ProcessedQuantity { get; set; }
        public Part? Part { get; set; }
    }
}
