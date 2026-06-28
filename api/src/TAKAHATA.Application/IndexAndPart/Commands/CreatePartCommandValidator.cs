using FluentValidation;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class CreatePartCommandValidator : AbstractValidator<CreatePartCommand>
    {
        public CreatePartCommandValidator()
        {
            RuleFor(c => c.IndexCode).NotEmpty().WithMessage("Mã index máy không được để trống.");
            RuleFor(c => c.PartCode).NotEmpty().WithMessage("Mã part máy không được để trống.");
        }
    }
}
