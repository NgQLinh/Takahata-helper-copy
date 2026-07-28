using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.Equipment
{
    public class MachineLogResponse : Machine
    {
        public PartResponse? Part { get; set; }
    }
}
