using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class PartResponse : Response
    {
        public int IndexId { get; set; }
        public string Code { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public IndexResponse? Index { get; set; }
        public ProcessStatus Status { get; set; }
        public bool Prioritize { get; set; } = false;
        public PartType PartType { get; set; }
        public PartNewRepair? NewRepair { get; set; }
        public bool IsClosed { get; set; }
        public ICollection<PartProcessResponse> Processes { get; set; } = [];
    }
}
