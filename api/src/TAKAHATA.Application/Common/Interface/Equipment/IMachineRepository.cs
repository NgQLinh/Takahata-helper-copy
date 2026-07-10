using ErrorOr;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Equipment
{
    public interface IMachineRepository : IBaseRepository<Machine>
    {
        Task<bool> IsExistedAsync(string name, string code);
        Task<bool> IsExistedExceptIdAsync(string name, string code, long id);
        Task<IEnumerable<Machine>> GetAsync();
    }
}
