using ErrorOr;
using MediatR;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public record IndexQuery() : IRequest<ErrorOr<IEnumerable<Index>>>;
}
