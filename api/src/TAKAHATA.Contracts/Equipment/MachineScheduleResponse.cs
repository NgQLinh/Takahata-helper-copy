using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.Equipment
{
    public class MachineScheduleResponse : MachineResponse
    {
        public List<PartProcessResponse> PartProcesses { get; set; } = [];
    }
}
