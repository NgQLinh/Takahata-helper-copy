using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IIndexRepository
    {
        public Task<Index?> AddAsync(Index Index);

        public Task<IEnumerable<Index>> GetAsync();

        public Task<Index?> GetByIdAsync(long id);

        public Task<Index?> DeleteIndexByIdAsync(long id);

        public Task<Index?> UpdateAsync(Index Index);
    }
}
