using Microsoft.Extensions.DependencyInjection;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.DataLog;
using TAKAHATA.Domain.MasterData;
using Serilog.Context;
using Microsoft.Extensions.Logging;

namespace TAKAHATA.Application.Services
{
    public class MachinePollingManager : IMachinePollingManager
    {
        private readonly IServiceScopeFactory _scopeFactory;

        private readonly ILogger<MachinePollingManager> _logger;

        private List<Machine> _machines = [];

        private volatile bool _reloadRequired = true;

        public MachinePollingManager(
            IServiceScopeFactory scopeFactory,
            ILogger<MachinePollingManager> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
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

            var machineRepository =
                scope.ServiceProvider
                    .GetRequiredService<IMachineRepository>();

            var partProcessRepository =
                scope.ServiceProvider
                    .GetRequiredService<IPartProcessRepository>();

            var pLCService =
                scope.ServiceProvider
                .GetRequiredService<IPLCService>();

            while (!stoppingToken.IsCancellationRequested)
            {
                if (_reloadRequired)
                {
                    await ReloadMachines();
                    _reloadRequired = false;
                }

                try
                {
                    using (LogContext.PushProperty("MachineLog", true))
                    {
                        var machineNeedUpdate = new List<Machine>();

                        foreach (var machine in _machines)
                        {
                            _logger.LogInformation(
                                "{Manager} | Machine: {MachineId} | Status: {Status} | PartId: {PartId} | PartProcessId: {PartProcessId}",
                                nameof(MachinePollingManager),
                                machine.Id,
                                machine.MachineStatus,
                                machine.PartId,
                                machine.PartProcessId);

                            // Dọc dữ lệu
                            var log = await ReadData(machine, pLCService);

                            _logger.LogInformation(
                                "[MachineLog] MachineId={MachineId}, Status={Status}, PartId={PartId}, PartProcessId={PartProcessId}",
                                log.MachineId,
                                log.Status,
                                log.PartId,
                                log.PartProcessId);

                            // Kiểm tra sự thay đổi
                            if (log.Status != machine.MachineStatus
                                || log.PartId != machine.PartId
                                || log.PartProcessId != machine.PartProcessId)
                            {

                                _logger.LogInformation(
                                     "[MachineLog] MachineId={MachineId}, Status={Status}, PartId={PartId}, PartProcessId={PartProcessId}",
                                     log.MachineId,
                                     log.Status,
                                     log.PartId,
                                     log.PartProcessId);

                                // Trạng thái đổi từ Running sang trạng thái khác, tính thời gian chạy
                                if (machine.MachineStatus == MachineStatus.Running && log.Status != MachineStatus.Running)
                                {
                                    var runningTime = log.Time - machine.MachineStatusChangeAt;

                                    _logger.LogInformation(
                                        """
                                            ==================== MACHINE STATUS CHANGED ====================
                                            Machine           : {MachineName}
                                            Status            : {OldStatus} -> {NewStatus}
                                            PartProcessId     : Machine={MachinePartProcessId}, Log={LogPartProcessId}
                                            ChangeAt          : {MachineStatusChangeAt:yyyy-MM-dd HH:mm:ss.fff}
                                            CurrentLogTime    : {LogTime:yyyy-MM-dd HH:mm:ss.fff}
                                            RunningTime       : {RunningTime}
                                            TotalSeconds      : {TotalSeconds}
                                            TotalMinutes      : {TotalMinutes}
                                            ===============================================================
                                            """,
                                        machine.Name,
                                        machine.MachineStatus,
                                        log.Status,
                                        machine.PartProcessId,
                                        log.PartProcessId,
                                        machine.MachineStatusChangeAt,
                                        log.Time,
                                        runningTime,
                                        runningTime?.TotalSeconds,
                                        runningTime?.TotalMinutes);

                                    if (runningTime.HasValue && log.PartProcessId != 0)
                                    {
                                        var workingTime = runningTime.Value.TotalMinutes;
                                        var process = await partProcessRepository.GetByIdAsync(log.PartProcessId);

                                        if (process != null)
                                        {
                                            var before = process.WorkingTime ?? 0;
                                            var added = runningTime.Value.TotalMinutes;

                                            process.WorkingTime = before + added;

                                            _logger.LogInformation(
                                                """
                                                            -------------------- UPDATE WORKING TIME --------------------
                                                            Machine         : {MachineName}
                                                            PartProcessId   : {PartProcessId}
                                                            Before          : {Before}
                                                            Added           : {Added}
                                                            After           : {After}
                                                            -------------------------------------------------------------
                                                            """,
                                                machine.Name,
                                                process.Id,
                                                before,
                                                added,
                                                process.WorkingTime);

                                            await partProcessRepository.UpdateAsync(process, stoppingToken);
                                        }
                                        else
                                        {
                                            _logger.LogWarning(
                                                "Không tìm thấy PartProcess. Id={PartProcessId}",
                                                machine.PartProcessId);
                                        }
                                    }
                                }

                                machine.PartId = log.PartId;
                                machine.PartProcessId = log.PartProcessId;
                                machine.MachineStatus = log.Status;
                                machine.UpdateAt = DateTime.Now;
                                machine.MachineStatusChangeAt = DateTime.Now;
                                machineNeedUpdate.Add(machine);
                            }
                            await Task.Delay(20, stoppingToken);
                        }

                        if (machineNeedUpdate.Count != 0)
                            await machineRepository.UpdateManyAsync(machineNeedUpdate, stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Gián đoạn trong quá trình quét dữ liệu: {ex.Message}");
                }

                await Task.Delay(3000, stoppingToken);
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

        private async Task<MachineLog> ReadData(Machine machine, IPLCService pLCService)
        {
            var result = await pLCService.ReadMachineData(machine);

            if (result.IsSuccess && result.Value != null)
            {
                var log = new MachineLog
                {
                    MachineId = machine.Id,
                    PartId = result.Value.PartId,
                    PartProcessId = result.Value.PartProcessId,
                    Status = (MachineStatus)result.Value.Status
                };

                return log;
            }
            else
            {
                var log = new MachineLog
                {
                    MachineId = machine.Id,
                    PartId = 0,
                    PartProcessId = 0,
                    Status = MachineStatus.None
                };

                return log;
            }
        }
    }
}
