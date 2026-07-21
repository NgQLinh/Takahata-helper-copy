using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Infrastructure.Settings;

namespace TAKAHATA.Infrastructure.Services
{
    public class PLCSettingsService : IPLCSettingsService
    {
        public void Update(string ipAddress, int port)
        {
            PLCSetting.Default.IpAddress = ipAddress;
            PLCSetting.Default.Port = port;
            PLCSetting.Default.Save();
        }

        public string GetIpAddress()
        {
            return PLCSetting.Default.IpAddress;
        }

        public int GetPort()
        {
            return PLCSetting.Default.Port;
        }
    }
}
