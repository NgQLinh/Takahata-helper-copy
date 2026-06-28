using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Part
        {
            public static Error DuplicatePartCode =>
                Error.Validation(code: "Account.DuplicatePartCode", description: "Duplicate PartCode.");

            public static Error CreateIndexFalse =>
                Error.Validation(code: "Index.CreateIndexFalse", description: "Create Index False.");

            public static Error UpdateIndexFalse =>
                Error.Validation(code: "Index.UpdateIndexFalse", description: "Update Index False.");

            public static Error NotFound =>
                Error.NotFound(code: "Index.NotFoundIndex", description: "Not Found Index.");

            public static Error Unauthorized =>
                Error.Unauthorized(code: "Index.Unauthorized", description: "Unauthorized.");
        }
    }

}
