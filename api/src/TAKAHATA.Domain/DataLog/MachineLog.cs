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
        public int Status { get; set; }

        [Column(IsTimestamp = true)]
        public DateTime Time { get; set; } = DateTime.Now;

        public MachineStatus GetStatus()
        {
            return Enum.IsDefined(typeof(MachineStatus), Status)
                ? (MachineStatus)Status
                : throw new InvalidOperationException($"Invalid status value: {Status}");
        }

        public void SetStatus(MachineStatus status)
        {
            Status = (int)status;
        }
    }
}
