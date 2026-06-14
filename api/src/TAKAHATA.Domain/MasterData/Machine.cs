using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MachineOperation;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Domain.MasterData
{
    public class Machine : Entity
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public MachineStatus MachineStatus { get; set; } = MachineStatus.Active;
        public int BitAddress { get; set; }
        public IEnumerable<WorkOrder> WorkOrders { get; set; } = [];
        public IEnumerable<MachineSchedule> MachineSchedules { get; set; } = [];
        public IEnumerable<MachineOperationLog> OperationLogs { get; set; } = [];
        public IEnumerable<MachineDailySummary> DailySummaries { get; set; } = [];
    }
}
