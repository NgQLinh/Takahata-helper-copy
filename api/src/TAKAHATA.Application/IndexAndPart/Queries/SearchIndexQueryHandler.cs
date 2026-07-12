using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class SearchIndexQueryHandler : IRequestHandler<SearchIndexQuery, ErrorOr<SearchResponse<List<IndexResponse>>>>
    {
        private readonly IIndexRepository _indexRepository;

        public SearchIndexQueryHandler(IIndexRepository indexRepository)
        {
            _indexRepository = indexRepository;
        }

        public async Task<ErrorOr<SearchResponse<List<IndexResponse>>>> Handle(
            SearchIndexQuery request,
            CancellationToken cancellationToken)
        {
            return await _indexRepository.Search(request.Keyword, request.Page, request.PageZie);
        }
    }
}
