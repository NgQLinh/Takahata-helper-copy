using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class PartsQueryHandler : IRequestHandler<PartsQuery, ErrorOr<IEnumerable<Part>>>
    {
        private readonly IPartRepository _partRepository;

        public PartsQueryHandler(IPartRepository partRepository)
        {
            _partRepository = partRepository;
        }

        public async Task<ErrorOr<IEnumerable<Part>>> Handle(PartsQuery request, CancellationToken cancellationToken)
        {
            var result = await _partRepository.SearchAsync(request.page, request.pageSize);

            return result.ToList();
        }
    }
}
