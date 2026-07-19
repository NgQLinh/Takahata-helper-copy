using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Diagnostics;
using TAKAHATA.Application.Common.Interface.Equipment;

namespace TAKAHATA.Infrastructure.Services
{
    public class MachinePollingBackgroundService : BackgroundService
    {
        private CancellationTokenSource _pollingCts = new();

        private readonly IServiceScopeFactory _scopeFactory;

        public MachinePollingBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public void RestartPolling()
        {
            _pollingCts.Cancel();
            _pollingCts = new CancellationTokenSource();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var linked = CancellationTokenSource.CreateLinkedTokenSource(
                    stoppingToken,
                    _pollingCts.Token);

                using var scope = _scopeFactory.CreateScope();

                var repository =
                    scope.ServiceProvider
                         .GetRequiredService<IMachineRepository>();

                var machines = await repository.GetAsync();

                try
                {
                    while (!linked.Token.IsCancellationRequested)
                    {
                        Debug.Print($"{machines}");
                        await Task.Delay(500, linked.Token);
                    }
                }
                catch (OperationCanceledException)
                {
                    Debug.Print("Restart");
                }
            }
        }
    }
}
