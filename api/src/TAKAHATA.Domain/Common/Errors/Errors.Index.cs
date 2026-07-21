using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Index
        {
            public static Error CreateFalse =>
                Error.Validation(code: "Index.CreateFalse", description: "Tạo mới index không thành công.");

            public static Error UpdateFalse =>
                Error.Validation(code: "Index.UpdateFalse", description: "Cập nhật index không thành công.");

            public static Error DuplicateIndexCode =>
                Error.Validation(code: "Index.DuplicateIndexCode", description: "Index code đã tồn tại.");

            public static Error DeleteFalse =>
                Error.Validation(code: "Index.DeleteIndexFalse", description: "Xóa index không thành công.");

            public static Error NotFound =>
                Error.NotFound(code: "Index.NotFound", description: "Không tìm thấy Index.");
        }
    }

}
