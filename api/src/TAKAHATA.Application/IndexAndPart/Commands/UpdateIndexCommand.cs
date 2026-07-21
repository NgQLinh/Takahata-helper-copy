using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record UpdateIndexCommand(long Id, string Code) : IRequest<ErrorOr<IndexResponse>>;
}
