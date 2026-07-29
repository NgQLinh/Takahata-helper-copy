using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.MaintenanceProcess
{
    public class MachineMaintenanceProcessResponse : Response
    {
        public long MachineId { get; set; }
        public DateOnly PlantDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? PerformedBy { get; set; } = string.Empty;
        public string? Note { get; set; } = string.Empty;
        public ProcessStatus Status { get; set; } = ProcessStatus.Planned;
        public MachineResponse? Machine { get; set; }
    }
}
