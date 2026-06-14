using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Machine
        {
            public static Error CreateMachineFalse =>
                Error.Validation(code: "Machine.CreateMachineFalse", description: "Create Machine False.");

            public static Error UpdateMachineFalse =>
                Error.Validation(code: "Machine.UpdateMachineFalse", description: "Update Machine False.");

            public static Error NotFound =>
                Error.NotFound(code: "Machine.NotFoundMachine", description: "Not Found Machine.");

            public static Error Unauthorized =>
                Error.Unauthorized(code: "Machine.Unauthorized", description: "Unauthorized.");
        }
    }

}
