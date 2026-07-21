using FluentValidation;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class UpdatePartCommandValidator : AbstractValidator<UpdatePartCommand>
    {
        public UpdatePartCommandValidator()
        {
            RuleFor(c => c.IndexCode).NotEmpty().WithMessage("Mã index không được để trống.");
            RuleFor(c => c.PartCode).NotEmpty().WithMessage("Mã part không được để trống.");
        }
    }
}
