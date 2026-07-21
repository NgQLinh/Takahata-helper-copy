namespace TAKAHATA.Application.Common.Interface.Services
{
    public interface IPLCSettingsService
    {
        public void Update(string ipAddress, int port);
        public string GetIpAddress();
        public int GetPort();
    }
}
