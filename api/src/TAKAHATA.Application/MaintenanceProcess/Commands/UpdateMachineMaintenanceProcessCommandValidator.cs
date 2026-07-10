using FluentValidation;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public class UpdateMachineMaintenanceProcessCommandValidator : AbstractValidator<UpdateMachineMaintenanceProcessCommand>
    {
        public UpdateMachineMaintenanceProcessCommandValidator()
        {
            RuleFor(c => c.Id).NotEqual(0).WithMessage("Dữ liệu đầu vào không hợp lệ.");
            RuleFor(c => c.MachineId).NotEqual(0).WithMessage("Vui lòng chọn máy.");
            RuleFor(c => c.PlanDate).NotNull().NotEqual(DateOnly.MinValue).WithMessage("Vui nhập ngày kế hoạch.");
            RuleFor(c => c.WorkingHours).GreaterThan(0).WithMessage("Vui nhập thời gian làm.");
        }
    }
}
