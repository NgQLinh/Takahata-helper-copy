using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Domain.WorkOrderAndSchedule
{
    public class MachineSchedule : Entity
    {
        public long MachineId { get; set; }

        public Machine Machine { get; set; } = null!;

        public long? WorkOrderId { get; set; }

        public WorkOrder? WorkOrder { get; set; }

        public DateTime ScheduleDate { get; set; }

        public string? ShiftCode { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public decimal? PlannedHours { get; set; }

        public WorkStatus Status { get; set; } = WorkStatus.Planning;

        public string? Note { get; set; }
    }
}
