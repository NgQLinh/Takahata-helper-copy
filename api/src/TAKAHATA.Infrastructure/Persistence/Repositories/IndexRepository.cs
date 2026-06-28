using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class IndexRepository : IIndexRepository
    {
        private readonly AppDbContext _dbContext;

        public IndexRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Index?> AddAsync(Index Index)
        {
            await _dbContext.Indexes.AddAsync(Index);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? Index : null;
        }

        public async Task<IEnumerable<Index>> GetAsync()
        {
            return await _dbContext.Indexes.ToListAsync();
        }

        public async Task<Index?> GetByIdAsync(long id)
        {
            return await _dbContext.Indexes.FindAsync(id);
        }

        public async Task<Index?> DeleteIndexByIdAsync(long id)
        {
            var Index = await _dbContext.Indexes.FindAsync(id);
            if (Index == null)
                return null;

            _dbContext.Indexes.Remove(Index);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? Index : null;
        }

        public async Task<Index?> UpdateAsync(Index Index)
        {
            _dbContext.Indexes.Update(Index);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? Index : null;
        }
    }
}
