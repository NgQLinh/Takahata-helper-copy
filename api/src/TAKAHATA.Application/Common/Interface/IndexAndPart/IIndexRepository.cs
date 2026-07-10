using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IIndexRepository : IBaseRepository<Index>
    {
        Task<IEnumerable<Index>> GetAsync();
        Task<Index?> GetAsync(string indexCode);
        Task<bool> IsExistedAsync(string indexCode);
    }
}
