using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Account
        {
            public static Error DuplicateEmployeeId =>
                Error.Validation(
                    code: "Auth.DuplicateEmployeeId",
                    description: "Duplicate Employee Id."
                );

            public static Error DuplicateUserName =>
                Error.Validation(code: "Auth.DuplicateUserName", description: "Duplicate User Name.");

            public static Error CreateAccountFalse =>
                Error.Validation(code: "Auth.CreateAccountFalse", description: "Create Account False.");

            public static Error UpdateAccountFalse =>
                Error.Validation(code: "Auth.UpdateAccountFalse", description: "Update Account False.");

            public static Error NotFound =>
                Error.NotFound(code: "Auth.NotFoundAccount", description: "Not Found Account.");
        }
    }

}
