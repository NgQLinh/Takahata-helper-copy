using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Part
        {
            public static Error DuplicatePartCode =>
                Error.Validation(code: "Part.DuplicatePartCode", description: "PartCode đã tồn tại.");

            public static Error CreateIndexFalse =>
                Error.Failure(code: "Part.CreateIndexFalse", description: "Cập nhật part không thành công.");

            public static Error UpdateIndexFalse =>
                Error.Failure(code: "Part.UpdateIndexFalse", description: "Cập nhật part không thành công.");

            public static Error DeleteIndexFalse =>
                Error.Failure(code: "Part.DeleteIndexFalse", description: "Xóa part không thành công.");

            public static Error NotFound =>
                Error.NotFound(code: "Part.NotFoundIndex", description: "Không tìm thấy part.");
        }
    }

}
