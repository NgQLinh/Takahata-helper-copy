using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public class PartQueryHandler : IRequestHandler<PartQuery, ErrorOr<PartResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPartRepository _partRepository;

        public PartQueryHandler(
            IMapper mapper,
            IPartRepository partRepository)
        {
            _mapper = mapper;
            _partRepository = partRepository;
        }

        public async Task<ErrorOr<PartResponse>> Handle(
            PartQuery request,
            CancellationToken cancellationToken)
        {
            var part = await _partRepository.GetByIdAsync(request.Id);
            if (part == null)
                return Errors.Part.NotFound;

            part.Processes = part.Processes
                .OrderBy(x => x.Sequence)
                .ToList();

            return _mapper.Map<PartResponse>(part);
        }
    }
}
