using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MachineOperation;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Domain.MoldManagement;

namespace TAKAHATA.Domain.WorkOrderAndSchedule
{
    public class WorkOrder : Entity
    {
        public long ProjectId { get; set; }
        public MoldProject Project { get; set; } = null!;
        public long? PartId { get; set; }
        public MoldPart? Part { get; set; }
        public long ProcessTypeId { get; set; }
        public ProcessType ProcessType { get; set; } = null!;
        public long? MachineId { get; set; }
        public Machine? Machine { get; set; }
        public string? WorkOrderCode { get; set; }
        public DateTime? PlanStart { get; set; }
        public DateTime? PlanEnd { get; set; }
        public decimal? PlanHours { get; set; }
        public DateTime? ActualStart { get; set; }
        public DateTime? ActualEnd { get; set; }
        public decimal? ActualHours { get; set; }
        public int Priority { get; set; } = 3;
        public WorkStatus Status { get; set; } = WorkStatus.Planning;
        public string? Note { get; set; }
        public IEnumerable<MachineSchedule> MachineSchedules { get; set; } = [];
        public IEnumerable<MachineOperationLog> OperationLogs { get; set; } = [];
    }
}
