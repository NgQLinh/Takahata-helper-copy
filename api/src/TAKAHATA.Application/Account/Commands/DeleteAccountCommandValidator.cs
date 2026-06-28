using FluentValidation;

namespace TAKAHATA.Application.Account.Commands
{
    public class DeleteAccountCommandValidator : AbstractValidator<DeleteAccountCommand>
    {
        public DeleteAccountCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Tên đăng nhập không được để trống.");
        }
    }
}
