using FluentValidation;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class UpdateIndexCommandValidator : AbstractValidator<UpdateIndexCommand>
    {
        public UpdateIndexCommandValidator()
        {
            RuleFor(c => c.Code).NotEmpty().WithMessage("Mã index không được để trống.");
        }
    }
}
