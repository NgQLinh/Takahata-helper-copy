using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class DeleteIndexCommandHandler : IRequestHandler<DeleteIndexCommand, ErrorOr<IndexResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IIndexRepository _indexRepository;

        public DeleteIndexCommandHandler(
            IMapper mapper,
            IIndexRepository indexRepository)
        {
            _mapper = mapper;
            _indexRepository = indexRepository;
        }

        public async Task<ErrorOr<IndexResponse>> Handle(
            DeleteIndexCommand request,
            CancellationToken cancellationToken)
        {
            var index = await _indexRepository.DeleteByIdAsync(request.Id);
            if (index == null)
                return Errors.Index.DeleteFalse;

            return _mapper.Map<IndexResponse>(index);
        }
    }
}
