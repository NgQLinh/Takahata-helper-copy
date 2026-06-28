namespace TAKAHATA.Contracts.IndexAndPart
{
    public class PartsQueryResponse
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int Total { get; set; }
        public IEnumerable<PartResponse> Parts { get; set; } = [];
    }
}
