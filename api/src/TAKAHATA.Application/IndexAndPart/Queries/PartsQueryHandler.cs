using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class PartsQueryHandler : IRequestHandler<PartsQuery, ErrorOr<PartsQueryResponse>>
    {
        private readonly IMapper _mapper;

        private readonly IPartRepository _partRepository;

        public PartsQueryHandler(IPartRepository partRepository, IMapper mapper)
        {
            _partRepository = partRepository;
            _mapper = mapper;
        }

        public async Task<ErrorOr<PartsQueryResponse>> Handle(
            PartsQuery request,
            CancellationToken cancellationToken)
        {
            var page = request.page;
            var pageSize = request.pageSize;

            if (page <= 0)
                page = 1;

            if (pageSize <= 0)
                pageSize = 10;

            var result = await _partRepository.SearchAsync(page, pageSize);

            var total = await _partRepository.CountTotal();

            var parts = result
                .Select(r => _mapper.Map<PartResponse>(r))
                .ToList();

            var response = new PartsQueryResponse
            {
                Page = page,
                PageSize = pageSize,
                Parts = parts,
                Total = total
            };

            return response;
        }
    }
}
