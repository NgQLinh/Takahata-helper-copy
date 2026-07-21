using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public record SearchIndexQuery(
        string? Keyword,
        int? Page,
        int? PageZie) : IRequest<ErrorOr<SearchResponse<List<IndexResponse>>>>;
}
