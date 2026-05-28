using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static Error InvalidCredentials =>
            Error.Validation(code: "Auth.InvalidCred", description: "Invalid credentials.");

        public static Error NotFoundUser =>
            Error.Unexpected(code: "Auth.NotFoundUser", description: "Không tìm thấy User");

        public static Error NotFoundInfoUser =>
            Error.Unexpected(
                code: "Auth.NotFoundInfoUser",
                description: "Không tìm thấy thông tin User"
            );

        public static Error PasswordInValid =>
            Error.Unexpected(code: "Auth.PaswordInCorect", description: "Mật khẩu không đúng");

        public static Error FileNotFound =>
            Error.Unexpected(code: "Auth.FileNotFound", description: "Không tồn tại File");

        public static Error AddFileError =>
            Error.Unexpected(code: "Auth.AddFile", description: "Tải file lên DB thất bại");

        public static Error DeviceTypeInvalid =>
            Error.Unexpected(code: "Auth.DeviceTypeInvalid", description: "Loại thiết bị không hợp lệ");
    }

}
