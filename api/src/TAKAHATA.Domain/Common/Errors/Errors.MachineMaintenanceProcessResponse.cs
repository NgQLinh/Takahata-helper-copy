using ErrorOr;

namespace TAKAHATA.Domain.Common.Errors
{
    public partial class Errors
    {
        public static class MachineMaintenanceProcess
        {
            public static Error CreateMachineMaintenanceProcessFalse =>
                Error.Failure(code: "MachineMaintenanceProcess.CreateFalse", description: "Tạo mới kế hoạch bảo trì không thành công.");

            public static Error UpdateMachineMaintenanceProcessFalse =>
                Error.Failure(code: "MachineMaintenanceProcess.UpdateFalse", description: "Cập nhật kế hoạch bảo trì không thành công.");

            public static Error DeleteMachineMaintenanceProcessFalse =>
                Error.Failure(code: "MachineMaintenanceProcess.DeleteFalse", description: "Xóa kế hoạch bảo trì không thành công.");

            public static Error NotFound =>
                Error.Failure(code: "MachineMaintenanceProcess.NotFound", description: "Không tìm thấy khế hoạch bảo trì.");
        }
    }
}
