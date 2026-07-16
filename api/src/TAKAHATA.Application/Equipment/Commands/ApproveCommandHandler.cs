using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class ApproveCommandHandler : IRequestHandler<ApproveCommand, ErrorOr<PartResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPartRepository _partRepository;

        public ApproveCommandHandler(
            IMapper mapper,
            IPartRepository partRepository)
        {
            _mapper = mapper;
            _partRepository = partRepository;
        }

        public async Task<ErrorOr<PartResponse>> Handle(
            ApproveCommand request,
            CancellationToken cancellationToken)
        {
            var result = await _partRepository.ApproveAsync(request.Id);

            if (result == null)
                return Errors.Part.ApproveFalse;

            return _mapper.Map<PartResponse>(result);
        }
    }
}
