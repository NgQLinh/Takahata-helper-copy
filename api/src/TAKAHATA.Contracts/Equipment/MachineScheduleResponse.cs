using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Contracts.Equipment
{
    public class MachineScheduleResponse : MachineResponse
    {
        public List<MachineProcessResponse> Processes { get; set; } = [];
    }
}
