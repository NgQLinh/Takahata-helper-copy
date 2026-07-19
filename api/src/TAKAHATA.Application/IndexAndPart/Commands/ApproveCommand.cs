using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record ApproveCommand(int Id) : IRequest<ErrorOr<PartResponse>>;
}
