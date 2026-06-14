using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Domain.MoldManagement
{
    public class MoldPart : Entity
    {
        public long ProjectId { get; set; }
        public MoldProject Project { get; set; } = null!;
        public string PartCode { get; set; } = string.Empty;
        public string? PartName { get; set; }
        public int Quantity { get; set; } = 1;
        public WorkStatus Status { get; set; } = WorkStatus.Planning;
        public IEnumerable<WorkOrder> WorkOrders { get; set; } = [];
    }
}
