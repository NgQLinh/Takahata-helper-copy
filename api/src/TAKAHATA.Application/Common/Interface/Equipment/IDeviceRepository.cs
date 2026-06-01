using ErrorOr;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Common.Interface.Equipment
{
    public interface IDeviceRepository
    {
        Task<Device?> AddDeviceAsync(Device device);
        Task<IEnumerable<Device>> GetAsync();
        Task<Device?> GetByIdAsync(long id);
        Task<Device?> DeleteDeviceByIdAsync(long id);
        Task<Device?> UpdateAsync(Device entity);
    }
}
