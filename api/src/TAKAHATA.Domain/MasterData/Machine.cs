using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.MasterData
{
    public class Machine : Entity
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public MachineStatus MachineStatus { get; set; } = MachineStatus.Running;
        public int StatusBitAddress { get; set; }
        public int PartBitAddress { get; set; }
        public int PartProcessBitAddress { get; set; }
        public List<PartProcess> PartProcesses { get; set; } = [];
        public List<MachineMaintenanceProcess> MachineMaintenanceProcesses { get; set; } = [];
    }
}
