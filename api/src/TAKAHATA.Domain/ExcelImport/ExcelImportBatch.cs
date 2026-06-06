using TAKAHATA.Domain.Common;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Domain.ExcelImport
{
    public class ExcelImportBatch : Entity
    {
        public string FileName { get; set; } = string.Empty;
        public string? FileType { get; set; }
        public string? ImportedBy { get; set; }
        public DateTime ImportedAt { get; set; } = DateTime.UtcNow;
        public WorkStatus Status { get; set; } = WorkStatus.Planning;
        public string? Note { get; set; }
        public IEnumerable<ExcelImportError> Errors { get; set; } = [];
    }
}
