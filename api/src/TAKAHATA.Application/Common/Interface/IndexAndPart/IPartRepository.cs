using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IPartRepository
    {
        Task<bool> IsExistedAsync(string partCode);
        Task<Part?> AddAsync(Part device);
        Task<IEnumerable<Part>> GetAsync();
        Task<Part?> GetByIdAsync(long id);
        Task<Part?> DeleteDeviceByIdAsync(long id);
        Task<Part?> UpdateAsync(Part device);
    }
}
