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
            var part = await _dbContext.Partes.FirstOrDefaultAsync(p => p.Code == partCode);
            return part != null;
        }

        public async Task<Part?> AddAsync(Part part)
        {
            await _dbContext.Partes.AddAsync(part);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? part : null;
        }

        public async Task<IEnumerable<Part>> GetAsync()
        {
            return await _dbContext.Partes.ToListAsync();
        }

        public async Task<Part?> GetByIdAsync(long id)
        {
            return await _dbContext.Partes.FindAsync(id);
        }

        public async Task<Part?> DeleteMachineByIdAsync(long id)
        {
            var part = await _dbContext.Partes.FindAsync(id);
            if (part == null)
                return null;

            _dbContext.Partes.Remove(part);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? part : null;
        }

        public async Task<Part?> UpdateAsync(Part part)
        {
            _dbContext.Partes.Update(part);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? part : null;
        }
    }
}
