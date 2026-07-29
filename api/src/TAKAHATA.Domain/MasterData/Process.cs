using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class Process : Entity
    {
        public long MachineId { get; set; }
        public DateOnly? PlantDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? PerformedBy { get; set; } = string.Empty;
        public string? Note { get; set; } = string.Empty;
        public ProcessStatus Status { get; set; } = ProcessStatus.Planned;
    }
}
