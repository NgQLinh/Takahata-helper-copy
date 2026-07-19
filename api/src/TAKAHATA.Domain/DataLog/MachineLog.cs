using InfluxDB.Client.Core;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.DataLog
{
    [Measurement("machine_log")]
    public class MachineLog
    {
        // Tags (dùng để filter)
        [Column("machineId", IsTag = true)]
        public long MachineId { get; set; }

        [Column("partId", IsTag = true)]
        public long PartId { get; set; }

        // Fields
        [Column("status")]
        public MachineStatus Status { get; set; }

        [Column(IsTimestamp = true)]
        public DateTime Time { get; set; } = DateTime.UtcNow;
    }
}
