using ErrorOr;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Equipment
{
    public interface IDeviceRepository
    {
        Task<Machine?> AddDeviceAsync(Machine device);
        Task<IEnumerable<Machine>> GetAsync();
        Task<Machine?> GetByIdAsync(long id);
        Task<Machine?> DeleteDeviceByIdAsync(long id);
        Task<Machine?> UpdateAsync(Machine entity);
    }
}
