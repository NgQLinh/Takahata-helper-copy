using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class PartResponse : Response
    {
        public long IndexId { get; set; }
        public string Code { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int ProcessedQuantity { get; set; }
        public IndexResponse? Index { get; set; }
        public ProcessStatus Status { get; set; }
        public ICollection<PartProcessResponse> Processes { get; set; } = [];
    }
}
