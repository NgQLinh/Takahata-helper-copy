using TAKAHATA.Domain.DataLog;

namespace TAKAHATA.Application.Common.Interface.Influx.Repositories
{
    public interface IMachineLogRepository
    {
        Task InsertAsync(MachineLog log);
        Task InsertAsync(IEnumerable<MachineLog> logs);
        Task<MachineLog?> GetLatestAsync(long machineId);
        Task<List<MachineLog>> GetLatestAsync();
        Task<List<MachineLog>> GetHistoryAsync(
            long machineId,
            DateTime from,
            DateTime to);
    }
}
