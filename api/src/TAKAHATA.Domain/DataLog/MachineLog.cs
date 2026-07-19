using InfluxDB.Client.Core;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.DataLog
{
    [Measurement("machine_log")]
    public class MachineLog
    {
        [Column("machineId", IsTag = true)]
        public long MachineId { get; set; }

        [Column("machineName")]
        public string? MachineName { get; set; }

        [Column("machineCode")]
        public string? MachineCode { get; set; }

        [Column("partId", IsTag = true)]
        public long PartId { get; set; }

        [Column("partName")]
        public string? PartName { get; set; }

        [Column("partCode")]
        public string? PartCode { get; set; }

        [Column("status")]
        public MachineStatus MachineStatus { get; set; }

        [Column(IsTimestamp = true)]
        public DateTime Time { get; set; } = DateTime.UtcNow;
    }
}
