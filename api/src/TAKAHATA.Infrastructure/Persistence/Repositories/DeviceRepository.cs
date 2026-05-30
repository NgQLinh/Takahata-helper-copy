using ErrorOr;
using Microsoft.EntityFrameworkCore;
using TAKAHATA.Application.Common.Interface.User;
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

        public async Task<ErrorOr<IEnumerable<Device>>> GetAsync()
        {
            return await _dbContext.Devices.ToListAsync();
        }
    }
}
