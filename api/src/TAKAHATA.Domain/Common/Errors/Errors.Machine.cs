using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Machine
        {
            public static Error DuplicateMachine =>
                Error.Validation(code: "Machine.DuplicateMachine", description: "Tên hoặc mã máy đã tồn tại.");

            public static Error CreateFalse =>
                Error.Failure(code: "Machine.CreateFalse", description: "Tạo mới máy không thành công.");

            public static Error UpdateFalse =>
                Error.Failure(code: "Machine.UpdateFalse", description: "Cập nhật máy không thành công.");

            public static Error DeleteFalse =>
                Error.Failure(code: "Machine.DeleteFalse", description: "Xóa máy không thành công.");

            public static Error NotFound =>
                Error.NotFound(code: "Machine.NotFound", description: "Không tìm thấy máy.");
        }
    }

}
