using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class PartProcess : Entity
    {
        public long PartId { get; set; }
        public int Sequence { get; set; }
        public long MachineId { get; set; }
        public DateOnly? PlanDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public decimal? WorkingHours { get; set; }
        public bool IsCompleted { get; set; }
    }
}
