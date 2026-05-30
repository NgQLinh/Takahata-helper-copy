using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Contracts.Equipment
{
    public class CreateDeviceRequest
    {
        public string Name { get; set; } = string.Empty;
        public DeviceType Type { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
    }
}
