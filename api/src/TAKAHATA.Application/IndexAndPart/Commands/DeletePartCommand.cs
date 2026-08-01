using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record DeletePartCommand(int Id) : IRequest<ErrorOr<PartResponse>>;
}
