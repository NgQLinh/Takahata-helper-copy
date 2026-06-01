using FluentValidation;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class UpdateDeviceCommandValidator : AbstractValidator<UpdateDeviceCommand>
    {
        public UpdateDeviceCommandValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Device ID is required.");
        }
    }
}
