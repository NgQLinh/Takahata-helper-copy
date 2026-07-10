namespace TAKAHATA.Contracts.Common
{
    public class SearchResponse<T> where T : class
    {
        public int Page { get; set; }

        public int PageSize { get; set; }

        public int TotalItems { get; set; }

        public T Data { get; set; }

        public SearchResponse(
            int page,
            int pageSize,
            int totalItems,
            T data)
        {
            Page = page;
            PageSize = pageSize;
            TotalItems = totalItems;
            Data = data;
        }
    }
}
