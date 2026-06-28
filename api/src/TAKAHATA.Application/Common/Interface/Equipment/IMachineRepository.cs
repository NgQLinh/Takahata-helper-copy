using ErrorOr;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Equipment
{
    public interface IMachineRepository
    {
        Task<bool> IsExistedAsync(string name, string code);
        Task<bool> IsExistedExceptIdAsync(string name, string code, long id);
        Task<Machine?> AddAsync(Machine machine);
        Task<IEnumerable<Machine>> GetAsync();
        Task<Machine?> GetByIdAsync(long id);
        Task<Machine?> DeleteMachineByIdAsync(long id);
        Task<Machine?> UpdateAsync(Machine entity);
    }
}
