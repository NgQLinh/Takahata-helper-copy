using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc.RazorPages;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class PartsQueryHandler : IRequestHandler<PartsQuery, ErrorOr<SearchResponse<List<PartResponse>>>>
    {
        private readonly IMapper _mapper;

        private readonly IPartRepository _partRepository;

        public PartsQueryHandler(IPartRepository partRepository, IMapper mapper)
        {
            _partRepository = partRepository;
            _mapper = mapper;
        }

        public async Task<ErrorOr<SearchResponse<List<PartResponse>>>> Handle(
            PartsQuery request,
            CancellationToken cancellationToken)
        {

            return await _partRepository.SearchAsync(
                request.SearchText,
                request.Statuses,
                request.PlantFrom,
                request.PlantTo,
                request.ActualFrom,
                request.ActualTo,
                request.Page,
                request.PageSize);
        }
    }
}
