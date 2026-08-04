using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Common
        {
            /// <summary>
            /// 400 - Yêu cầu không hợp lệ
            /// </summary>
            public static Error BadRequest =>
                Error.Validation(
                    code: "Common.BadRequest",
                    description: "Yêu cầu không hợp lệ.");

            /// <summary>
            /// 401 - Chưa xác thực
            /// </summary>
            public static Error Unauthorized =>
                Error.Unauthorized(
                    code: "Common.Unauthorized",
                    description: "Bạn chưa được xác thực.");

            /// <summary>
            /// 403 - Không có quyền
            /// </summary>
            public static Error Forbidden =>
                Error.Forbidden(
                    code: "Common.Forbidden",
                    description: "Bạn không có quyền thực hiện thao tác này.");

            /// <summary>
            /// 404 - Không tìm thấy dữ liệu
            /// </summary>
            public static Error NotFound =>
                Error.NotFound(
                    code: "Common.NotFound",
                    description: "Không tìm thấy dữ liệu.");

            /// <summary>
            /// 409 - Dữ liệu đã tồn tại
            /// </summary>
            public static Error Conflict =>
                Error.Conflict(
                    code: "Common.Conflict",
                    description: "Dữ liệu đã tồn tại.");

            /// <summary>
            /// 500 - Lỗi hệ thống
            /// </summary>
            public static Error InternalServerError =>
                Error.Failure(
                    code: "Common.InternalServerError",
                    description: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");

            /// <summary>
            /// Thao tác thất bại
            /// </summary>
            public static Error OperationFailed =>
                Error.Failure(
                    code: "Common.OperationFailed",
                    description: "Thực hiện thao tác không thành công.");

            /// <summary>
            /// Dữ liệu đầu vào không hợp lệ
            /// </summary>
            public static Error ValidationFailed =>
                Error.Validation(
                    code: "Common.ValidationFailed",
                    description: "Dữ liệu đầu vào không hợp lệ.");
        }
    }
}
