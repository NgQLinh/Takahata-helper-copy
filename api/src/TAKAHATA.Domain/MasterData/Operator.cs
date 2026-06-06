using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.MachineOperation;

namespace TAKAHATA.Domain.MasterData
{
    public class Operator : Entity
    {
        public string OperatorCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Department { get; set; }
        public bool IsActive { get; set; } = true;
        public IEnumerable<MachineOperationLog> OperationLogs { get; set; } = [];
    }
}
