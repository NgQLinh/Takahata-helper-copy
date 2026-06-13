using FluentValidation;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class UpdateAccountCommandValidator : AbstractValidator<UpdateAccountCommand>
    {
        public UpdateAccountCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("UserName is required.");
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
