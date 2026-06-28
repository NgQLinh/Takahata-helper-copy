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

        public async Task<Part?> AddAsync(Part device)
        {
            await _dbContext.Partes.AddAsync(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }

        public async Task<IEnumerable<Part>> GetAsync()
        {
            return await _dbContext.Partes.ToListAsync();
        }

        public async Task<Part?> GetByIdAsync(long id)
        {
            return await _dbContext.Partes.FindAsync(id);
        }

        public async Task<Part?> DeleteDeviceByIdAsync(long id)
        {
            var device = await _dbContext.Partes.FindAsync(id);
            if (device == null)
                return null;

            _dbContext.Partes.Remove(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }

        public async Task<Part?> UpdateAsync(Part device)
        {
            _dbContext.Partes.Update(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }
    }
}
