namespace TAKAHATA.Domain.Equipments
{
    public class Equipment
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public EquipmentType Type { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string CreateBy { get; set; } = string.Empty;
        public DateTime? UpdateAt { get; set; }
        public string? UpdateBy { get; set; }
    }
}
