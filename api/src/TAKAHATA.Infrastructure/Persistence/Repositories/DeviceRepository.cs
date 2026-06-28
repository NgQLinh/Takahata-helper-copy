using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly AppDbContext _dbContext;

        public DeviceRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Machine?> AddAsync(Machine device)
        {
            await _dbContext.Machines.AddAsync(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }

        public async Task<IEnumerable<Machine>> GetAsync()
        {
            return await _dbContext.Machines.ToListAsync();
        }

        public async Task<Machine?> GetByIdAsync(long id)
        {
            return await _dbContext.Machines.FindAsync(id);
        }

        public async Task<Machine?> DeleteDeviceByIdAsync(long id)
        {
            var device = await _dbContext.Machines.FindAsync(id);
            if (device == null)
                return null;

            _dbContext.Machines.Remove(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }

        public async Task<Machine?> UpdateAsync(Machine device)
        {
            _dbContext.Machines.Update(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }
    }
}
