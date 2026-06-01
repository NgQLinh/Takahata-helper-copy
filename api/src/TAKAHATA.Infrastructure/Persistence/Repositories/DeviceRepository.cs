using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly AppDbContext _dbContext;

        public DeviceRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Device?> AddDeviceAsync(Device device)
        {
            await _dbContext.Devices.AddAsync(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }

        public async Task<IEnumerable<Device>> GetAsync()
        {
            return await _dbContext.Devices.ToListAsync();
        }

        public async Task<Device?> GetByIdAsync(long id)
        {
            return await _dbContext.Devices.FindAsync(id);
        }

        public async Task<Device?> DeleteDeviceByIdAsync(long id)
        {
            var device = await _dbContext.Devices.FindAsync(id);
            if (device == null)
                return null;

            _dbContext.Devices.Remove(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }

        public async Task<Device?> UpdateAsync(Device device)
        {
            _dbContext.Devices.Update(device);
            var effectedRow = await _dbContext.SaveChangesAsync();
            return effectedRow != 0 ? device : null;
        }
    }
}
