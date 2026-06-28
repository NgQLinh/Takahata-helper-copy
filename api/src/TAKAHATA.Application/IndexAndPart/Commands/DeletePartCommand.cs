using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record DeletePartCommand(long Id) : IRequest<ErrorOr<PartResponse>>;
}
