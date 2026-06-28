using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public record PartsQuery(int page, int pageSize) : IRequest<ErrorOr<PartsQueryResponse>>;
}
