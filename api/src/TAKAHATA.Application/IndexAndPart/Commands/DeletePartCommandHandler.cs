using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class DeletePartCommandHandler : IRequestHandler<DeletePartCommand, ErrorOr<PartResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPartRepository _partRepository;

        public DeletePartCommandHandler(IPartRepository partRepository, IMapper mapper)
        {
            _partRepository = partRepository;
            _mapper = mapper;
        }

        public async Task<ErrorOr<PartResponse>> Handle(DeletePartCommand request, CancellationToken cancellationToken)
        {
            var part = await _partRepository.DeleteByIdAsync(request.Id);
            if (part == null)
                return Errors.Part.DeleteFalse;

            return _mapper.Map<PartResponse>(part);
        }
    }
}
