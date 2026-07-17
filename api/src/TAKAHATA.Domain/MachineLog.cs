using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.DataLog
{
    public class MachineLog : Entity
    {
        public long MachineId { get; set; }
        public MachineStatus MachineStatus { get; set; } = MachineStatus.None;
        public long PartId { get; set; }
        public long PartProcessId { get; set; }
    }
}
