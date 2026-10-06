namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IUnitOfWorkRepository
    {
        Task UpdateDataAsync(
               int statusBitAddress,
               int status,
               int partId,
               int processId,
               double workingTime,
               double waitingTime,
               double setupTime);
    }
}
