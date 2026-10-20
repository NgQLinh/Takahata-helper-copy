using ErrorOr;
using MediatR;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record ClosePartCommand(int Id) : IRequest<ErrorOr<bool>>;
}
