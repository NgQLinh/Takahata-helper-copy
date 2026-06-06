using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.CostManagement;
using TAKAHATA.Domain.WorkOrderAndSchedule;

namespace TAKAHATA.Domain.MoldManagement
{
    public class MoldProject : Entity
    {
        public string MoldCode { get; set; } = string.Empty;
        public ProjectType ProjectType { get; set; }
        public string? Customer { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public WorkStatus Status { get; set; } = WorkStatus.Planning;
        public IEnumerable<MoldPart> Parts { get; set; } = [];
        public IEnumerable<WorkOrder> WorkOrders { get; set; } = [];
        public IEnumerable<ProjectCost> Costs { get; set; } = [];
    }
}
