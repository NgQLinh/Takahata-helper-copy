using FluentValidation;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class DeleteDeviceCommandValidator : AbstractValidator<DeleteDeviceCommand>
    {
        public DeleteDeviceCommandValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Device ID is required.");
        }
    }
}
