using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.IndexAndPart
{
    public interface IPartProcessRepository
    {
        Task<IEnumerable<PartProcess>> GetByMachineIdAsync(long machineId);
    }
}
