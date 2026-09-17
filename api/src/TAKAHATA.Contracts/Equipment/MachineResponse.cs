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
        public MachineType MachineType { get; set; } = MachineType.Automatic;

        public bool IsAutomatic { get; set; }

        public int PartId { get; set; }
        public int PartProcessId { get; set; }

        public int StatusBitAddress { get; set; }
        public int PartBitAddress { get; set; }
        public int PartProcessBitAddress { get; set; }
        public int SequenceNumber { get; set; }

        public bool HasScheduledMaintenance { get; set; }

        public DateTime? MachineStatusChangeAt { get; set; }
    }
}
