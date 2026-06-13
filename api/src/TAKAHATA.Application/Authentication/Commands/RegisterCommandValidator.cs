using FluentValidation;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterCommandValidator()
        {
            RuleFor(x => x.UserName)
                 .NotEmpty().WithMessage("UserName is required.")
                 .EmailAddress().WithMessage("UserName must be a valid email address.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.");
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("FullName is required.");
            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required.");
        }
    }
}
