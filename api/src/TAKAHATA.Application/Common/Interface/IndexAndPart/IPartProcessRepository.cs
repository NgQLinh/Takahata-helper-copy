using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IPartProcessRepository : IBaseRepository<PartProcess>
    {
        Task<SearchResponse<List<ManufacturingProcessResponse>>> SearchByMachineIdAsync(
            long machineId,
            int? page,
            int? pageSize);
    }
}
