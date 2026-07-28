using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Equipment
{
    public class MachineResponse : Response
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public MachineStatus MachineStatus { get; set; } = MachineStatus.Running;

        public long PartId { get; set; }
        public long PartProcessId { get; set; }

        public int StatusBitAddress { get; set; }
        public int PartBitAddress { get; set; }
        public int PartProcessBitAddress { get; set; }
        public int SequenceNumber { get; set; }

        public DateTime? MachineStatusChangeAt { get; set; }
    }
}
