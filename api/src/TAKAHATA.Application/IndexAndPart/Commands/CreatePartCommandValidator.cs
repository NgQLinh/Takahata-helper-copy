using FluentValidation;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class CreatePartCommandValidator : AbstractValidator<CreatePartCommand>
    {
        public CreatePartCommandValidator()
        {
            RuleFor(c => c.IndexCode).NotEmpty().WithMessage("IndexCode is required.");
            RuleFor(c => c.PartCode).NotEmpty().WithMessage("PartCode is required.");
        }
    }
}
