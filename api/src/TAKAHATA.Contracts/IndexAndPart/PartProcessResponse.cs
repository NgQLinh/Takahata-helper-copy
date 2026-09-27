using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class PartProcessResponse : Response
    {
        public int PartId { get; set; }
        public int Sequence { get; set; }
        public int MachineId { get; set; }
        public DateOnly? PlantDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public double? WorkingTime { get; set; }
        public double? SetupTime { get; set; }
        public double? WaitingTime { get; set; }
        public double? EstimatedTime { get; set; }
        public ProcessStatus Status { get; set; }
        public string Note { get; set; } = string.Empty;
        public string? PerformedBy { get; set; } = string.Empty;
        public string? WorkerNote { get; set; } = string.Empty;
        public double? ProgrammingTime { get; set; }
        public int ProcessedQuantity { get; set; }
        public MachineResponse? Machine { get; set; }
    }
}
