using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class MachineResponse
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public MachineStatus MachineStatus { get; set; } = MachineStatus.Active;
        public int BitAddress { get; set; }
    }
}
