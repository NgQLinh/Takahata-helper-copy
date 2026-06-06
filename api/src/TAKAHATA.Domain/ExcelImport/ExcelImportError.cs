using TAKAHATA.Domain.Common;

namespace TAKAHATA.Domain.ExcelImport
{
    public class ExcelImportError : Entity
    {
        public long BatchId { get; set; }

        public ExcelImportBatch Batch { get; set; } = null!;

        public string? SheetName { get; set; }

        public int? RowNumber { get; set; }

        public string? ColumnName { get; set; }

        public string ErrorMessage { get; set; } = string.Empty;
    }
}
