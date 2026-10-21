using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class ClosePartCommandHandler : IRequestHandler<ClosePartCommand, ErrorOr<bool>>
    {
        private readonly IPartRepository _partRepository;
        private readonly ICurrentUserService _currentUserService;

        public ClosePartCommandHandler(
            IPartRepository partRepository,
            ICurrentUserService currentUserService)
        {
            _partRepository = partRepository;
            _currentUserService = currentUserService;
        }

        public async Task<ErrorOr<bool>> Handle(
            ClosePartCommand request,
            CancellationToken cancellationToken)
        {
            var part = await _partRepository.CloseByIdAsync(
                request.Id,
                _currentUserService.UserId,
                cancellationToken);

            return part == null ? Errors.Part.NotFound : true;
        }
    }
}
