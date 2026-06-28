using FluentValidation;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class UpdateMachineCommandValidator : AbstractValidator<UpdateMachineCommand>
    {
        public UpdateMachineCommandValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id máy không được để trống.");
        }
    }
}
