using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.Report
{
    public class MachineKPIResponse
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public double? WorkingTime { get; set; }
        public double? MaintenanceTime { get; set; }
        public MachineStatus MachineStatus { get; set; } = MachineStatus.Running;
    }
}
