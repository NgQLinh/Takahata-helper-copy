namespace TAKAHATA.Application.Common.Interface.Services
{
    public interface IMachinePollingManager
    {
        Task RunAsync(CancellationToken stoppingToken);

        void RequestReload();

        void RestartPolling();
    }
}
