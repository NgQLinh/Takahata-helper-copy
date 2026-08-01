using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Contracts.Report;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IPartProcessRepository : IBaseRepository<PartProcess>
    {
        Task<SearchResponse<List<ManufacturingProcessResponse>>> SearchByMachineIdAsync(
            int machineId,
            int? page,
            int? pageSize);
        Task<List<PartProcessKPIResponse>> SearchKPIAsync(DateTime from, DateTime to);
    }
}
