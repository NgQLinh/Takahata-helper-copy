using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class MachineProcessResponse : Response
    {
        public long PartId { get; set; }
        public string PartCode { get; set; } = string.Empty;
        public DateOnly? PlantDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public decimal? WorkingHours { get; set; }
        public int Quantity { get; set; }
        public ProcessStatus Status { get; set; }
        public string Note { get; set; } = string.Empty;
    }
}
