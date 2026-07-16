using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Part
        {
            public static Error DuplicatePartCode =>
                Error.Validation(code: "Part.DuplicatePartCode", description: "PartCode đã tồn tại.");

            public static Error CreateFalse =>
                Error.Failure(code: "Part.CreateFalse", description: "Tạo mới part không thành công.");

            public static Error UpdateFalse =>
                Error.Failure(code: "Part.UpdateFalse", description: "Cập nhật part không thành công.");

            public static Error ApproveFalse =>
                Error.Failure(code: "Part.ApproveFalse", description: "Phê duyệt part không thành công.");

            public static Error DeleteFalse =>
                Error.Failure(code: "Part.DeleteFalse", description: "Xóa part không thành công.");

            public static Error NotFound =>
                Error.NotFound(code: "Part.NotFoundIndex", description: "Không tìm thấy part.");

            public static Error NotFoundProcess =>
                Error.NotFound(code: "Part.NotFoundProcess", description: "Không tìm thấy part process.");
        }
    }

}
