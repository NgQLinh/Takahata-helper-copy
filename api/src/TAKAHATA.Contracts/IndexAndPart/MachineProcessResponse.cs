using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class MachineProcessResponse : Response
    {
        public long PartId { get; set; }
        public string PartCode { get; set; } = string.Empty;
        public DateOnly? PlantDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public double? WorkingTime { get; set; }
        public int Quantity { get; set; }
        public ProcessStatus Status { get; set; }
        public string? Note { get; set; }
        public MachineProcessType Type { get; set; }
    }
}
