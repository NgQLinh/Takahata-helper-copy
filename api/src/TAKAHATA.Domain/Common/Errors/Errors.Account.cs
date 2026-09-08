using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Account
        {
            public static Error DuplicateUserName =>
                Error.Validation(code: "Account.DuplicateUserName", description: "Người dùng đã tồn tại.");

            public static Error InvalidCredentials =>
                Error.Validation(code: "Account.InvalidCredentials", description: "Thông tin đăng nhập không hợp lệ.");

            public static Error CreateAccountFalse =>
                Error.Failure(code: "Account.CreateFalse", description: "Tạo mới tài khoản không thành công.");

            public static Error UpdateAccountFalse =>
                Error.Failure(code: "Account.UpdateFalse", description: "Cập nhật tài khoản không thành công.");

            public static Error NotFound =>
                Error.NotFound(code: "Account.NotFound", description: "Không tìm thấy tài khoản.");

            public static Error DeleteAccountFalse =>
                Error.Failure(code: "Account.DeleteFalse", description: "Xóa tài khoản không thành công.");

            public static Error CanNotDeleteDefaultAccount =>
                Error.Failure(code: "Account.CanNotDeleteDefaultAccount", description: "Không thể xóa tài khoản mặc định.");
        }
    }

}
