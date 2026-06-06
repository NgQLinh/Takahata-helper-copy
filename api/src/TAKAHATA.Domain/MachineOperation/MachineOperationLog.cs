using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Domain.MachineOperation
{
    public class MachineOperationLog : Entity
    {
        public long MachineId { get; set; }

        public Machine Machine { get; set; } = null!;

        public long? WorkOrderId { get; set; }

        public WorkOrder? WorkOrder { get; set; }

        public long? OperatorId { get; set; }

        public Operator? Operator { get; set; }

        public DateTime LogTime { get; set; }

        public MachineStatus MachineStatus { get; set; }

        public bool IsAuto { get; set; }

        public bool IsManual { get; set; }

        public bool IsSetup { get; set; }

        public bool IsAlarm { get; set; }

        public bool IsRunning { get; set; }
    }
}
