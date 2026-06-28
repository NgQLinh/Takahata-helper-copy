using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IIndexRepository
    {
        Task<Index?> AddAsync(Index Index);
        Task<IEnumerable<Index>> GetAsync();
        Task<Index?> GetAsync(string indexCode);
        Task<Index?> GetByIdAsync(long id);
        Task<Index?> DeleteIndexByIdAsync(long id);
        Task<Index?> UpdateAsync(Index Index);
        Task<bool> IsExistedAsync(string indexCode);
    }
}
