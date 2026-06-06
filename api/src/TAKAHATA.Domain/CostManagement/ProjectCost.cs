using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.MoldManagement;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Domain.CostManagement
{
    public class ProjectCost : Entity
    {
        public long ProjectId { get; set; }

        public MoldProject Project { get; set; } = null!;

        public long? PartId { get; set; }

        public MoldPart? Part { get; set; }

        public long? WorkOrderId { get; set; }

        public WorkOrder? WorkOrder { get; set; }

        public long CostCategoryId { get; set; }

        public CostCategory CostCategory { get; set; } = null!;

        public decimal CostAmount { get; set; }

        public DateTime? CostDate { get; set; }

        public string? Note { get; set; }
    }
}
