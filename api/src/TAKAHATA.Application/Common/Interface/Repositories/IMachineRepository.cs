using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Contracts.Report;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IMachineRepository : IBaseRepository<Machine>
    {
        Task CreateDefaultMachine();
        Task<bool> IsExistedAsync(string name, string code);
        Task<bool> IsExistedExceptIdAsync(string name, string code, int id);
        Task<IEnumerable<Machine>> GetAsync();
        Task<SearchResponse<List<MachineResponse>>> SearchAsync(string? keyword, int? page, int? pageSize);
        Task<SearchResponse<List<MachineScheduleResponse>>> SearchSchedule(string keyword, DateOnly? plantFrom, DateOnly? plantTo, int page, int pageSize);
        Task<List<MachineKPIResponse>> SearchKPIAsync(DateTime from, DateTime to);
    }
}
