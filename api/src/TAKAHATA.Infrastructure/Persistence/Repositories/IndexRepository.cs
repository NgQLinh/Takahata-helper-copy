using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class IndexRepository : BaseRepository<Index>, IIndexRepository
    {
        public IndexRepository(AppDbContext dbContext) : base(dbContext)
        {

        }

        public async Task<IEnumerable<Index>> GetAsync()
        {
            return await _dbContext.Indexes.ToListAsync();
        }

        public async Task<Index?> GetAsync(string indexCode)
        {
            return _dbContext.Indexes.FirstOrDefault(e => e.Code == indexCode);
        }

        public async Task<bool> IsExistedAsync(string indexCode)
        {
            var index = await _dbContext.Indexes.FirstOrDefaultAsync(x => x.Code == indexCode);
            return index != null;
        }
    }
}
