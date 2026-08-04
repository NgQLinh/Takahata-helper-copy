using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Contracts.IndexAndPart
{
    public class ManufacturingProcessResponse : Response
    {
        public int IndexId { get; set; }
        public string IndexCode { get; set; } = string.Empty;
        public int PartId { get; set; }
        public string PartCode { get; set; } = string.Empty;
        public int Quantity { get; set; }

        public int ProcessedQuantity { get; set; }
        public ProcessStatus Status { get; set; }
        public string Note { get; set; } = string.Empty;
    }
}
