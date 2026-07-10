using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class PartRepository : BaseRepository<Part>, IPartRepository
    {

        public PartRepository(AppDbContext dbContext) : base(dbContext) 
        {
        }

        public async Task<bool> IsExistedAsync(string partCode)
        {
            var part = await _dbContext.Parts.FirstOrDefaultAsync(p => p.Code == partCode);
            return part != null;
        }

        public override async Task<Part?> GetByIdAsync(long id)
        {
            return await _dbContext.Parts
                .Include(p => p.Index)
                .Include(p => p.Processes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Part>> SearchAsync(int page, int pageSize)
        {
            return await _dbContext.Parts
                .Include(p => p.Index)
                .Include(p => p.Processes)
                .ThenInclude(pp => pp.Machine)
                .AsNoTracking()
                .OrderBy(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountTotal()
        {
            return await _dbContext.Parts.CountAsync();
        }
    }
}
