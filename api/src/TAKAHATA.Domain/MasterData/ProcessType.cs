using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Domain.MasterData
{
    public class ProcessType : Entity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public IEnumerable<WorkOrder> WorkOrders { get; set; } = [];
    }
}
