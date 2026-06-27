using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class Part : Entity
    {
        public long IndexId { get; set; }
        public string Code { get; set; } = string.Empty;
        public ICollection<PartProcess> Processes { get; set; } = [];
    }
}
