using TAKAHATA.Domain.DataLog;

namespace TAKAHATA.Application.Common.Interface.Repositories
{
    public interface IMachineLogRepository
    {
        Task AddRangeAsync(List<MachineLog> machineLogs, CancellationToken stoppingToken);
    }
}
