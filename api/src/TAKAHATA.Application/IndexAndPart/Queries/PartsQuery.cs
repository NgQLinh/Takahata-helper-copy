using ErrorOr;
using MediatR;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public record PartsQuery(int page, int pageSize) : IRequest<ErrorOr<IEnumerable<Part>>>;
}
