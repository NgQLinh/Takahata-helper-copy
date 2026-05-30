using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Contracts.Equipment
{
    public record CreateDeviceResponse
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DeviceType Type { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string CreateBy { get; set; } = string.Empty;
        public DeviceStatus Status { get; set; } = DeviceStatus.Active;
    }
}
