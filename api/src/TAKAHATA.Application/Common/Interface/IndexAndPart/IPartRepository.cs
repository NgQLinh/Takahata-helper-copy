using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IPartRepository: IBaseRepository<Part>
    {
        Task<bool> IsExistedAsync(string partCode);
        Task<IEnumerable<Part>> SearchAsync(int page, int pageSize);
        Task<int> CountTotal();
    }
}
