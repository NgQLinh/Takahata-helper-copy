using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Diagnostics;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Application.Common.Interface.Services;

namespace TAKAHATA.Application.Services
{
    public class MachinePollingBackgroundService
        : BackgroundService
    {
        private readonly IMachinePollingManager _manager;

        public MachinePollingBackgroundService(
            IMachinePollingManager manager)
        {
            _manager = manager;
        }

        protected override Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            return _manager.RunAsync(stoppingToken);
        }
    }
}
