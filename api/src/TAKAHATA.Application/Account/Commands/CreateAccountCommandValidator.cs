using FluentValidation;

namespace TAKAHATA.Application.Account.Commands
{
    public class CreateAccountCommandValidator : AbstractValidator<CreateAccountCommand>
    {
        public CreateAccountCommandValidator()
        {
            RuleFor(x => x.UserName)
                 .NotEmpty().WithMessage("Tên đăng nhập không được để trống.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Mật khẩu không được để trống.");
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Họ và tên không được để trống.");
            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Quyền không được để trống.");
        }
    }
}
