using ErrorOr;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IPartRepository
    {
        Task<bool> IsExistedAsync(string partCode);
        Task<Part?> AddAsync(Part part);
        Task<Part?> GetByIdAsync(long id);
        Task<Part?> DeleteMachineByIdAsync(long id);
        Task<Part?> UpdateAsync(Part part);
        Task<IEnumerable<Part>> SearchAsync(int page, int pageSize);
    }
}
