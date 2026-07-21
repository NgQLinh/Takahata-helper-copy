using ErrorOr;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IIndexRepository : IBaseRepository<Index>
    {
        Task<IEnumerable<Index>> GetAsync();
        Task<Index?> GetAsync(string indexCode);
        Task<bool> IsExistedAsync(string indexCode);
        Task<bool> IsExistedAsync(long id, string indexCode);
        Task<SearchResponse<List<IndexResponse>>> SearchAsync(string? keyword, int? page, int? pageSize);
    }
}
