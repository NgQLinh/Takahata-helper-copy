using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IPartRepository : IBaseRepository<Part>
    {
        Task<bool> IsExistedAsync(string partCode);
        Task<SearchResponse<List<PartResponse>>> SearchAsync(
            string? indexCode,
            string? partCode,
            List<ProcessStatus>? statuses,
            DateOnly? plantFrom,
            DateOnly? plantTo,
            DateTime? startFrom,
            DateTime? startTo,
            int page,
            int pageSize);
        Task<Part?> ApproveAsync(int id);
        Task<IEnumerable<Part>> GetByIdsAsync(HashSet<int> partIds);
    }
}
