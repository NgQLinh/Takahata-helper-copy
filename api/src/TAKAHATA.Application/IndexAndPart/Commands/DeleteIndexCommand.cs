using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public record DeleteIndexCommand(int Id) : IRequest<ErrorOr<IndexResponse>>;
}
