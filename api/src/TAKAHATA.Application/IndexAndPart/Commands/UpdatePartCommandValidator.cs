using FluentValidation;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class UpdatePartCommandValidator : AbstractValidator<UpdatePartCommand>
    {
        public UpdatePartCommandValidator()
        {
            RuleFor(c => c.IndexCode).NotEmpty().WithMessage("Mã index máy không được để trống.");
            RuleFor(c => c.PartCode).NotEmpty().WithMessage("Mã part máy không được để trống.");
        }
    }
}
