using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Domain.MachineOperation
{
    public class MachineDailySummary : Entity
    {
        public long MachineId { get; set; }

        public Machine Machine { get; set; } = null!;

        public DateTime SummaryDate { get; set; }

        public decimal AutoHours { get; set; }

        public decimal ManualHours { get; set; }

        public decimal SetupHours { get; set; }

        public decimal AlarmHours { get; set; }

        public decimal StopHours { get; set; }

        public decimal TotalHours { get; set; }

        public decimal? UtilizationPercent { get; set; }

        public decimal? AutoPercent { get; set; }
    }
}
