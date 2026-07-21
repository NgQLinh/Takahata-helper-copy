using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class UpdateIndexCommandHandler : IRequestHandler<UpdateIndexCommand, ErrorOr<IndexResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IIndexRepository _indexRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdateIndexCommandHandler(
            IMapper mapper,
            IIndexRepository indexRepository,
            ICurrentUserService currentUserService)
        {
            _mapper = mapper;
            _indexRepository = indexRepository;
            _currentUserService = currentUserService;
        }

        public async Task<ErrorOr<IndexResponse>> Handle(
            UpdateIndexCommand request,
            CancellationToken cancellationToken)
        {
            if(await _indexRepository.IsExistedAsync(request.Id, request.Code))
                return Errors.Index.DuplicateIndexCode;

            var index = await _indexRepository.GetByIdAsync(request.Id);
            if (index == null)
                return Errors.Index.NotFound;

            index.Code = request.Code;
            index.UpdateAt = DateTime.Now;
            index.UpdateBy = _currentUserService.UserId;

            index = await _indexRepository.UpdateAsync(index);
            if (index == null)
                return Errors.Index.UpdateFalse;

            return _mapper.Map<IndexResponse>(index);
        }
    }
}
