using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.CostManagement
{
    public class CostCategory : Entity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public IEnumerable<ProjectCost> ProjectCosts { get; set; } = [];
    }
}
