namespace TAKAHATA.Domain.Equipment
{
    public class Device
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DeviceType Type { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string CreateBy { get; set; } = string.Empty;
        public DateTime? UpdateAt { get; set; }
        public string? UpdateBy { get; set; }
        public DeviceStatus Status { get; set; } = DeviceStatus.Active;
    }
}
