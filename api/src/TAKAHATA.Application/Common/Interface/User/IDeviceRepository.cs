using ErrorOr;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Common.Interface.User
{
    public interface IDeviceRepository
    {
        Task<Device?> AddDeviceAsync(Device device);
        Task<ErrorOr<IEnumerable<Device>>> GetAsync();
    }
}
