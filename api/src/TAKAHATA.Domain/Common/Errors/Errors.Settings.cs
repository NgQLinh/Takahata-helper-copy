using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Settings
        {
            /// <summary>
            /// Thao tác thất bại
            /// </summary>
            public static Error OperationFailed =>
                Error.Failure(
                    code: "Settings.OperationFailed",
                    description: "Ghi dữ liệu không thành công.");
        }
    }
}
