using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class Device
        {
            public static Error CreateDeviceFalse =>
                Error.Validation(code: "Device.CreateDeviceFalse", description: "Create Device False.");

            public static Error UpdateDeviceFalse =>
                Error.Validation(code: "Device.UpdateDeviceFalse", description: "Update Device False.");

            public static Error NotFound =>
                Error.NotFound(code: "Device.NotFoundDevice", description: "Not Found Device.");
        }
    }

}
