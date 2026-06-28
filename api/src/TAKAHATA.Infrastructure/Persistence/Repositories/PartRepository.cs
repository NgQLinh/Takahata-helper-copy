using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class PartRepository : IPartRepository
    {
        private readonly AppDbContext _dbContext;

        public PartRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> IsExistedAsync(string partCode)
        {
            var part = await _dbContext.Parts.FirstOrDefaultAsync(p => p.Code == partCode);
            return part != null;
        }

        public async Task<Part?> AddAsync(Part part)
        {
            await _dbContext.Parts.AddAsync(part);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? part : null;
        }

        public async Task<Part?> GetByIdAsync(long id)
        {
            return await _dbContext.Parts.FindAsync(id);
        }

        public async Task<Part?> DeleteMachineByIdAsync(long id)
        {
            var part = await _dbContext.Parts.FindAsync(id);
            if (part == null)
                return null;

            _dbContext.Parts.Remove(part);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? part : null;
        }

        public async Task<Part?> UpdateAsync(Part part)
        {
            _dbContext.Parts.Update(part);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? part : null;
        }

        public async Task<IEnumerable<Part>> SearchAsync(int page, int pageSize)
        {
            return await _dbContext.Parts
                .Include(p => p.Index)
                .Include(p => p.Processes)
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
