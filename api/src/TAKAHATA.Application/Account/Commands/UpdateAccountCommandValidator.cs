using FluentValidation;

namespace TAKAHATA.Application.Account.Commands
{
    public class UpdateAccountCommandValidator : AbstractValidator<UpdateAccountCommand>
    {
        public UpdateAccountCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id is required.");

            RuleFor(x => x.UserName)
                .NotEmpty()
                .WithMessage("UserName is required.");

            RuleFor(x => x.FullName)
                .NotEmpty()
                .WithMessage("FullName is required.");

            RuleFor(x => x.Role)
                .NotEmpty()
                .WithMessage("Role is required.");

            RuleFor(x => x.Password)
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'""\\|,.<>/?]).{8,}$")
                .WithMessage("Password must contain at least 8 characters, including uppercase, lowercase, number and special character.")
                .When(x => !string.IsNullOrWhiteSpace(x.Password));
        }
    }
}