namespace TAKAHATA.Domain.Equipment
{
    public class DeviceLog
    {
        public long Id { get; set; }    
        public string EquipmentId { get; set; } = string.Empty;
        public DateTime ReadAt { get; set; } = DateTime.Now;
        public string Name { get; set; } = string.Empty;
        public OperatingStatus Status { get; set; } = OperatingStatus.None;
    }
}
