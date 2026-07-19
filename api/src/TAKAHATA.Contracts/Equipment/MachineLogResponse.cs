using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Equipment
{
    public class MachineLogResponse
    {
        public long MachineId { get; set; }
        public long PartId { get; set; }
        public MachineStatus Status { get; set; }
        public DateTime Time { get; set; } = DateTime.Now;
        public PartResponse? Part { get; set; }
        public MachineResponse? Machine { get; set; }
    }
}
