using FluentValidation;

namespace TAKAHATA.Application.Authentication.Commands
{
    public class RefreshCommandValidator : AbstractValidator<RefreshCommand>
    {
        public RefreshCommandValidator()
        {
            RuleFor(c => c.RefreshToken).NotEmpty().WithMessage("RefreshToken is required.");
        }
    }
}
