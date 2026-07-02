using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class CreatePartCommandHandler : IRequestHandler<CreatePartCommand, ErrorOr<PartResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPartRepository _partRepository;
        private readonly IIndexRepository _indexRepository;
        private readonly ICurrentUserService _currentUserService;

        public CreatePartCommandHandler(
            IMapper mapper,
            IPartRepository partRepository,
            IIndexRepository indexRepository,
            ICurrentUserService currentUserService)
        {
            _partRepository = partRepository;
            _indexRepository = indexRepository;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        public async Task<ErrorOr<PartResponse>> Handle(
            CreatePartCommand request,
            CancellationToken cancellationToken)
        {
            // Create index if it is not IsExisted
            if (!await _indexRepository.IsExistedAsync(request.IndexCode))
            {
                var newIndex = new Index
                {
                    Code = request.IndexCode,
                    CreateBy = _currentUserService.UserId
                };

                await _indexRepository.AddAsync(newIndex);
            }

            // Get index
            var index = await _indexRepository.GetAsync(request.IndexCode);
            if (index == null)
                return Errors.Index.NotFound;

            // Save part
            if (await _partRepository.IsExistedAsync(request.PartCode))
                return Errors.Part.DuplicatePartCode;

            var part = new Part
            {
                Code = request.PartCode,
                CreateBy = _currentUserService.UserId,
                IndexId = index.Id,
                Processes = [.. request.PartProcesses.OrderBy(x => x.PlanDate).Select((p, i) => new PartProcess
                {
                    CreateAt = DateTime.Now,
                    CreateBy = _currentUserService.UserId,
                    IsCompleted = false,
                    MachineId = p.MachineId,
                    Note = p.Note,
                    PlanDate = p.PlanDate,
                    Sequence = i + 1,
                })]
            };

            part = await _partRepository.AddAsync(part);
            if (part == null)
                return Errors.Index.CreateIndexFalse;

            return _mapper.Map<PartResponse>(part);
        }
    }
}
