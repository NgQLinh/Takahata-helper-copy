using FluentValidation;

namespace TAKAHATA.Application.Account.Commands
{
    public class UpdateAccountCommandValidator : AbstractValidator<UpdateAccountCommand>
    {
        public UpdateAccountCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id không được để trống.");

            RuleFor(x => x.UserName)
                .NotEmpty()
                .WithMessage("Tên đăng nhập không được để trống.");

            RuleFor(x => x.FullName)
                .NotEmpty()
                .WithMessage("Họ và tên không được để trống.");

            RuleFor(x => x.Role)
                .NotEmpty()
                .WithMessage("Quyền không được để trống.");

            RuleFor(x => x.Password)
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'""\\|,.<>/?]).{8,}$")
                .WithMessage("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.")
                .When(x => !string.IsNullOrWhiteSpace(x.Password));
        }
    }
}