using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.Equipment
{
    public class MachineLogResponse : Machine
    {
        public bool IDLE { get; set; }
        public PartResponse? Part { get; set; }
    }
}
