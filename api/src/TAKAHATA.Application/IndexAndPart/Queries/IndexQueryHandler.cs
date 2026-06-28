using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class IndexQueryHandler : IRequestHandler<IndexQuery, ErrorOr<IEnumerable<Index>>>
    {
        private readonly IIndexRepository _indexRepository;

        public IndexQueryHandler(IIndexRepository indexRepository)
        {
            _indexRepository = indexRepository;
        }

        public async Task<ErrorOr<IEnumerable<Index>>> Handle(
            IndexQuery request,
            CancellationToken cancellationToken)
        {
            var indexes = await _indexRepository.GetAsync();

            return indexes.ToList();
        }
    }
}
