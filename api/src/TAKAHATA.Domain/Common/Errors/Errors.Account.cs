using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Account
        {
            public static Error DuplicateEmployeeId =>
                Error.Validation(code: "Account.DuplicateEmployeeId", description: "Duplicate Employee Id.");

            public static Error DuplicateUserName =>
                Error.Validation(code: "Account.DuplicateUserName", description: "Duplicate User Name.");

            public static Error InvalidCredentials =>
                Error.Validation(code: "Account.InvalidCredentials", description: "Invalid Credentials.");

            public static Error CreateAccountFalse =>
                Error.Validation(code: "Account.CreateAccountFalse", description: "Create Account False.");

            public static Error UpdateAccountFalse =>
                Error.Validation(code: "Account.UpdateAccountFalse", description: "Update Account False.");

            public static Error NotFound =>
                Error.NotFound(code: "Account.NotFoundAccount", description: "Not Found Account.");

            public static Error DeleteAccountFalse =>
                Error.Validation(code: "Account.DeleteAccountFalse", description: "Delete Account False.");
        }
    }

}
