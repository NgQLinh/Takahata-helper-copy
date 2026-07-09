namespace TAKAHATA.Contracts.Common
{
    public class SearchResponse<T> where T : class
    {
        public int Page { get; set; }

        public int PageSize { get; set; }

        public int TotalItems { get; set; }

        public IEnumerable<T> Values { get; set; } = [];

        public SearchResponse(
            int page,
            int pageSize,
            int totalItems,
            IEnumerable<T> values)
        {
            Page = page;
            PageSize = pageSize;
            TotalItems = totalItems;
            Values = values;
        }
    }
}
