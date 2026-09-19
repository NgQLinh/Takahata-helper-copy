using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.MasterData
{
    public class Part : Entity
    {
        public int IndexId { get; set; }
        public string Code { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public Index? Index { get; set; }
        public ICollection<PartProcess> Processes { get; set; } = [];
        public ProcessStatus Status { get; set; } = ProcessStatus.Planned;
        public bool Prioritize { get; set; } = false;
        public PartType PartType { get; set; } = PartType.NewMold;
    }
}
