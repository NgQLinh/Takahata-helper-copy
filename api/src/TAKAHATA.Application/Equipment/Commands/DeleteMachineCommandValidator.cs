using FluentValidation;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class DeleteMachineCommandValidator : AbstractValidator<DeleteMachineCommand>
    {
        public DeleteMachineCommandValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Device ID is required.");
        }
    }
}
