using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IPartProcessRepository
    {
        Task<SearchResponse<List<ManufacturingProcessResponse>>> SearchByMachineIdAsync(
            long machineId,
            int? page,
            int? pageSize);
    }
}
