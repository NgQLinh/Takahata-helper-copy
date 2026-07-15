using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.Equipment
{
    public class MachineScheduleResponse : MachineResponse
    {
        public List<MachineProcessResponse> Processes { get; set; } = [];
    }
}
