using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class MachineMaintenanceProcess
        {
            public static Error CreateMachineMaintenanceProcessResponseFalse =>
                Error.Failure(code: "MachineMaintenanceProcessResponse.CreateFalse", description: "Tạo mới kế hoạch bảo trì không thành công.");

            public static Error UpdateMachineMaintenanceProcessResponseFalse =>
                Error.Failure(code: "MachineMaintenanceProcessResponse.UpdateFalse", description: "Cập nhật kế hoạch bảo trì không thành công.");

            public static Error DeleteMachineMaintenanceProcessResponseFalse =>
                Error.Failure(code: "MachineMaintenanceProcessResponse.DeleteFalse", description: "Xóa kế hoạch bảo trì không thành công.");
        }
    }
}
