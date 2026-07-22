using EasyModbus;
using TAKAHATA.Application.Common.Interface.Services;

namespace TAKAHATA.Infrastructure.Services
{
    public class PLCService : IPLCService
    {
        private readonly  IPLCSettingsService _settingsService;

        public PLCService(IPLCSettingsService settingsService)
        {
            _settingsService = settingsService;
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


