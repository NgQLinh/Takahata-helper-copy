using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.MaintenanceProcess
{
    public class MachineMaintenanceProcessResponse : Response
    {
        public long MachineId { get; set; }
        public DateOnly PlanDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public decimal WorkingHours { get; set; }
        public string? PerformedBy { get; set; } = string.Empty;
        public string? Note { get; set; } = string.Empty;
        public ProcessStatus Status { get; set; } = ProcessStatus.Planned;
        public MachineResponse? Machine { get; set; }
    }
}
