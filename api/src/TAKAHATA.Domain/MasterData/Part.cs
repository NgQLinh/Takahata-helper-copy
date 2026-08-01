using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class Part : Entity
    {
        public int IndexId { get; set; }
        public string Code { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public int ProcessedQuantity { get; set; }
        public Index? Index { get; set; }
        public ICollection<PartProcess> Processes { get; set; } = [];
        public ProcessStatus Status { get; set; } = ProcessStatus.Planned;
    }
}
