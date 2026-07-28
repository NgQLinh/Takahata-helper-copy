using Microsoft.Extensions.DependencyInjection;
using TAKAHATA.Application.Common.Interface.Repositories;
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

            while (!stoppingToken.IsCancellationRequested)
            {
                if (_reloadRequired)
                {
                    await ReloadMachines();
                    _reloadRequired = false;
                }

                var machineNeedUpdate = new List<Machine>();
                foreach (var machine in _machines)
                {
                    // Dọc dữ lệu
                    var log = ReadData(machine);

                    // Kiểm tra sự thay đổi
                    if (log.Status != machine.MachineStatus
                        || log.PartId != machine.PartId
                        || log.PartProcessId != machine.PartPorcessId)
                    {
                        await machineLogRepository.AddAsync(log, stoppingToken);

                        if (machine.MachineStatus == MachineStatus.Running && log.Status == MachineStatus.Stopped)
                        {
                            var runningTime = log.Time - machine.MachineStatusChangeAt;

                            if (runningTime.HasValue && log.PartProcessId != 0)
                            {
                                var workingTime = runningTime.Value.TotalMinutes;
                                var process = await partProcessRepository.GetByIdAsync(log.PartProcessId);

                                if (process != null)
                                {
                                    process.WorkingTime = Math.Round(workingTime, 2);
                                    await partProcessRepository.UpdateAsync(process, stoppingToken);
                                }
                            }
                        }

                        machine.PartId = log.PartId;
                        machine.PartPorcessId = log.PartProcessId;
                        machine.MachineStatus = log.Status;
                        machine.UpdateAt = DateTime.Now;
                        machine.MachineStatusChangeAt = DateTime.Now;
                        machineNeedUpdate.Add(machine);
                    }
                    await Task.Delay(20, stoppingToken);
                }

                if (machineNeedUpdate.Count != 0)
                    await machineRepository.UpdateManyAsync(machineNeedUpdate, stoppingToken);

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


        private static readonly Random _random = new();

        private MachineLog ReadData(Machine machine)
        {
            var log = new MachineLog
            {
                MachineId = machine.Id,
                PartId = _random.Next(1, 100),
                PartProcessId = _random.Next(1, 10),
                Status = (MachineStatus)_random.Next(Enum.GetValues<MachineStatus>().Length)
            };

            return log;
        }
    }
}
