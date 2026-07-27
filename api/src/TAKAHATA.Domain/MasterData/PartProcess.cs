using System.Timers;
using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class PartProcess : Entity
    {
        public long PartId { get; set; }
        public int Sequence { get; set; }
        public long MachineId { get; set; }
        public DateOnly? PlantDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public double? WorkingTime { get; set; } // Được ghi tự động bằng PLC
        public double? SetupTime { get; set; }
        public double? WaitingTime { get; set; }
        public string Note { get; set; } = string.Empty;
        public Part? Part { get; set; }
        public ProcessStatus Status { get; set; } = ProcessStatus.Planned;
        public Machine? Machine { get; set; }
    }
}
