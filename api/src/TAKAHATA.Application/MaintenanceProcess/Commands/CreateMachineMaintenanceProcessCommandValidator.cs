using FluentValidation;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public class CreateMachineMaintenanceProcessCommandValidator : AbstractValidator<CreateMachineMaintenanceProcessCommand>
    {
        public CreateMachineMaintenanceProcessCommandValidator()
        {
            RuleFor(c => c.MachineId).NotEqual(0).WithMessage("Vui lòng chọn máy.");
            RuleFor(c => c.PlantDate).NotNull().NotEqual(DateOnly.MinValue).WithMessage("Vui nhập ngày kế hoạch.");
        }
    }
}
