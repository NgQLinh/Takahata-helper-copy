using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class SystemConfig : Entity
    {
        public const int SingletonId = 1;
        public string IpAddress { get; set; } = "192.168.1.1";
        public int Port { get; set; } = 502;
    }
}
