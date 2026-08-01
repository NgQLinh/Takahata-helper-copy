using EasyModbus;
using Microsoft.Extensions.Logging;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Domain.PLC;
using Machine = TAKAHATA.Domain.MasterData.Machine;

namespace TAKAHATA.Infrastructure.Services
{
    public class PLCService : IPLCService
    {
        private readonly ILogger<PLCService> _logger;
        private readonly IPLCSettingsService _settingsService;

        public PLCService(
            IPLCSettingsService settingsService,
            ILogger<PLCService> logger)
        {
            _settingsService = settingsService;
            _logger = logger;
        }

        public async Task<PLCResult<ReadResult>> ReadMachineData(Machine machine)
        {
            _logger.LogInformation($"{nameof(ReadMachineData)}: Start");

            var ip = _settingsService.GetIpAddress();
            var port = _settingsService.GetPort();

            _logger.LogInformation($"{nameof(ReadMachineData)}: Connection info {ip}:{port}");

            var modbusClient = new ModbusClient(ip, port);

            try
            {
                modbusClient.Connect();

                var status = modbusClient.ReadHoldingRegisters(machine.StatusBitAddress, 1);
                var partId = modbusClient.ReadHoldingRegisters(machine.PartBitAddress, 1);
                var partProcessId = modbusClient.ReadHoldingRegisters(machine.PartProcessBitAddress, 1);

                return PLCResult<ReadResult>.Success(new ReadResult
                {
                    Status = status[0],
                    PartId = partId[0],
                    PartProcessId = partProcessId[0]
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"{nameof(ReadMachineData)}: {ex.Message}");
                return PLCResult<ReadResult>.Fail(ex);
            }
            finally
            {
                if (modbusClient != null && modbusClient.Connected)
                {
                    modbusClient.Disconnect();
                }
            }
        }

        public async Task<PLCResult<List<ReadResult>>> ReadMachinesData(List<Machine> machines)
        {
            _logger.LogInformation($"{nameof(ReadMachinesData)}: Start");

            var ip = _settingsService.GetIpAddress();
            var port = _settingsService.GetPort();

            _logger.LogInformation($"{nameof(ReadMachinesData)}: Connection info {ip}:{port}");

            var modbusClient = new ModbusClient(ip, port);

            try
            {
                modbusClient.Connect();

                var results = new List<ReadResult>();

                foreach (var machine in machines)
                {
                    var status = modbusClient.ReadHoldingRegisters(machine.StatusBitAddress, 1);
                    var partId = modbusClient.ReadHoldingRegisters(machine.PartBitAddress, 1);
                    var partProcessId = modbusClient.ReadHoldingRegisters(machine.PartProcessBitAddress, 1);

                    var readResult = new ReadResult
                    {
                        Status = status[0],
                        PartId = partId[0],
                        PartProcessId = partProcessId[0]
                    };
                    results.Add(readResult);

                    await Task.Delay(50);
                }

                return PLCResult<List<ReadResult>>.Success(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"{nameof(ReadMachinesData)}: {ex.Message}");
                return PLCResult<List<ReadResult>>.Fail(ex);
            }
            finally
            {
                if (modbusClient != null && modbusClient.Connected)
                {
                    modbusClient.Disconnect();
                }
            }
        }

        public async Task<PLCResult<WriteResult>> WriteMachineData(Machine machine, int partId, int processId)
        {
            _logger.LogInformation($"{nameof(WriteMachineData)}: Start");

            var ip = _settingsService.GetIpAddress();
            var port = _settingsService.GetPort();

            _logger.LogInformation($"{nameof(WriteMachineData)}: Connection info {ip}:{port}");

            var modbusClient = new ModbusClient(ip, port);

            try
            {
                modbusClient.Connect();

                modbusClient.WriteSingleRegister(machine.PartBitAddress, partId);
                modbusClient.WriteSingleRegister(machine.PartProcessBitAddress, processId);

                return PLCResult<WriteResult>.Success(new WriteResult());
            }
            catch (Exception ex)
            {
                _logger.LogError($"{nameof(WriteMachineData)}: {ex.Message}");
                return PLCResult<WriteResult>.Fail(ex);
            }
            finally
            {
                if (modbusClient != null && modbusClient.Connected)
                {
                    modbusClient.Disconnect();
                }
            }
        }

        public bool TestConnection()
        {
            try
            {
                var client = new ModbusClient(_settingsService.GetIpAddress(), _settingsService.GetPort());

                client.Connect();

                bool currentValue = client.ReadCoils(10, 1)[0];

                bool newValue = !currentValue;

                client.WriteSingleCoil(10, newValue);

                client.Disconnect();

                return true;
            }
            catch
            {

                return false;
            }
        }
    }
}


