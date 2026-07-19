using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IPartRepository: IBaseRepository<Part>
    {
        Task<bool> IsExistedAsync(string partCode);
        Task<SearchResponse<List<PartResponse>>> SearchAsync(
            string? searchText,
            List<ProcessStatus>? statuses,
            DateOnly? plantFrom,
            DateOnly? plantTo,
            DateOnly? actualFrom,
            DateOnly? actualTo,
            int page,
            int pageSize);
        Task<int> CountTotal();
        Task<Part?> ApproveAsync(int id);
        Task<IEnumerable<Part>> GetByIdsAsync(HashSet<long> partIds);
    }
}
