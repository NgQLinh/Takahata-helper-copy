using FluentValidation;

namespace TAKAHATA.Application.Account.Commands
{
    public class CreateAccountCommandValidator : AbstractValidator<CreateAccountCommand>
    {
        public CreateAccountCommandValidator()
        {
            RuleFor(x => x.UserName)
                 .NotEmpty().WithMessage("UserName is required.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.");
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("FullName is required.");
            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required.");
        }
    }
}
