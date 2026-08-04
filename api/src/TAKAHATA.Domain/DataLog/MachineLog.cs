using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.DataLog
{
    public class MachineLog
    {
        public int MachineId { get; set; }
        public int PartId { get; set; }
        public int PartProcessId { get; set; }
        public MachineStatus Status { get; set; }
        public DateTime Time { get; set; } = DateTime.Now;
    }
}
