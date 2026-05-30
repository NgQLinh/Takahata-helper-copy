namespace TAKAHATA.Domain.Equipments
{
    public class EquipmentLog
    {
        public long Id { get; set; }    
        public string EquipmentId { get; set; } = string.Empty;
        public DateTime ReadAt { get; set; } = DateTime.Now;
        public string Name { get; set; } = string.Empty;
        public EquipmentStatus Status { get; set; } = EquipmentStatus.None;
    }
}
