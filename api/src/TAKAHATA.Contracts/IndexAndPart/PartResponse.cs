using TAKAHATA.Contracts.Common;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class PartResponse : Response
    {
        public long IndexId { get; set; }
        public string Code { get; set; } = string.Empty;
        public IndexResponse? Index { get; set; }
        public ICollection<PartProcessResponse> Processes { get; set; } = [];
    }
}
