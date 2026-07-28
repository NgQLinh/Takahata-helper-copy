using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.DataLog
{
    public class MachineLog : Entity
    {
        public long MachineId { get; set; }
        public long PartId { get; set; }
        public long PartProcessId { get; set; }
        public MachineStatus Status { get; set; }
        public DateTime Time { get; set; } = DateTime.Now;
    }
}
