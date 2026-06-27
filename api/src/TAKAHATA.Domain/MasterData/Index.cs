using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.MasterData
{
    public class Index : Entity
    {
        public string Code { get; set; } = string.Empty;

        public ICollection<Part> Parts { get; set; } = [];
    }
}
