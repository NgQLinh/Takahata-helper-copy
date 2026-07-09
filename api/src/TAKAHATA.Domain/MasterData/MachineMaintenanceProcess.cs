using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class MachineMaintenanceProcess : Entity
    {
        public long MachineId { get; set; }
        public string MaintenanceType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateOnly? PlanDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public decimal? WorkingHours { get; set; }
        public string PerformedBy { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public ProcessStatus Status { get; set; } = ProcessStatus.Planned;
        public Machine? Machine { get; set; }
    }
}
