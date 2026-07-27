using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Application.Common.Interface.Influx.Repositories;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.DataLog;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Services
{
    public class MachinePollingManager : IMachinePollingManager
    {
        private readonly IServiceScopeFactory _scopeFactory;

        private List<Machine> _machines = [];

        private volatile bool _reloadRequired = true;

        public MachinePollingManager(
            IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public void RequestReload()
        {
            _reloadRequired = true;
        }

        public void RestartPolling()
        {
            _reloadRequired = true;
        }

        public async Task RunAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_reloadRequired)
                {
                    await ReloadMachines();

                    _reloadRequired = false;
                }

                await PollMachines(stoppingToken);

                await Task.Delay(2000, stoppingToken);
            }
        }

        private async Task ReloadMachines()
        {
            using var scope = _scopeFactory.CreateScope();

            var machineRepository =
                scope.ServiceProvider
                     .GetRequiredService<IMachineRepository>();

            var machines = await machineRepository.GetAsync();
            _machines = [.. machines];

            Console.WriteLine($"Reload {_machines.Count} machines");
        }

        private async Task PollMachines(CancellationToken token)
        {
            using var scope = _scopeFactory.CreateScope();

            var machineLogRepository =
                scope.ServiceProvider
                     .GetRequiredService<IMachineLogRepository>();

            var machineRepository =
                scope.ServiceProvider
                    .GetRequiredService<IMachineRepository>();

            var partProcessRepository =
                scope.ServiceProvider
                    .GetRequiredService<IPartProcessRepository>();


            var machineNeedUpdate = new List<Machine>();
            foreach (var machine in _machines)
            {
#if DEBUG
                var log = GenerateRandomLog(machine, out long processId);
                await machineLogRepository.InsertAsync(log);
#endif
                if (machine.MachineStatus != log.GetStatus())
                {
                    if (machine.MachineStatus == MachineStatus.Running && log.GetStatus() == MachineStatus.Stopped)
                    {
                        var runningTime = log.Time - machine.MachineStatusChangeAt;

                        if (runningTime.HasValue && processId != 0)
                        {
                            var workingTime = runningTime.Value.TotalMinutes;
                            var process = await partProcessRepository.GetByIdAsync(processId);

                            if (process != null)
                            {
                                process.WorkingTime = Math.Round(workingTime, 2);
                                await partProcessRepository.UpdateAsync(process);
                            }
                        }
                    }

                    machine.MachineStatus = log.GetStatus();
                    machine.UpdateAt = DateTime.Now;
                    machine.MachineStatusChangeAt = DateTime.Now;
                    machineNeedUpdate.Add(machine);
                }
                await Task.Delay(20, token);
            }

            if (machineNeedUpdate.Count != 0)
                await machineRepository.UpdateManyAsync(machineNeedUpdate, token);
        }

        private static readonly Random _random = new();

        private MachineLog GenerateRandomLog(Machine machine, out long processId)
        {
            processId = _random.Next(1, 10);

            var log = new MachineLog
            {
                MachineId = machine.Id,
                PartId = _random.Next(1, 100)
            };

            log.SetStatus((MachineStatus)_random.Next(Enum.GetValues<MachineStatus>().Length));

            return log;
        }
    }
}
