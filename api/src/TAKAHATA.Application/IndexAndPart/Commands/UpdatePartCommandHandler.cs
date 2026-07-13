using ErrorOr;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Diagnostics;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;
using Index = TAKAHATA.Domain.MasterData.Index;

namespace TAKAHATA.Application.IndexAndPart.Commands
{
    public class UpdatePartCommandHandler : IRequestHandler<UpdatePartCommand, ErrorOr<PartResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPartRepository _partRepository;
        private readonly IIndexRepository _indexRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdatePartCommandHandler(
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
            UpdatePartCommand request,
            CancellationToken cancellationToken)
        {
            // 1. Create Index if not exists
            var index = await _indexRepository.GetAsync(request.IndexCode);
            if (index == null)
            {
                index = new Index
                {
                    Code = request.IndexCode,
                    CreateBy = _currentUserService.UserId,
                    CreateAt = DateTime.Now
                };

                index = await _indexRepository.AddAsync(index);

                if (index == null)
                    return Errors.Index.CreateIndexFalse;
            }

            // 2. Get Part include Processes
            var part = await _partRepository.GetByIdAsync(request.Id);
            if (part == null)
                return Errors.Part.NotFound;

            if (await _partRepository.IsExistedAsync(request.PartCode) && part.Code != request.PartCode)
                return Errors.Part.DuplicatePartCode;

            // 3. Update Part
            part.Code = request.PartCode;
            part.IndexId = index.Id;
            part.UpdateBy = _currentUserService.UserId;
            part.UpdateAt = DateTime.Now;

            var requestProcesses = request.PartProcesses ?? new List<PartProcessRequest>();

            var newProcesses = requestProcesses
                .Where(x => x.Id == 0)
                .ToList();

            var updateProcesses = requestProcesses
                .Where(x => x.Id != 0)
                .ToList();

            // 4. Remove deleted processes
            var requestUpdateProcessIds = updateProcesses
                .Select(x => x.Id)
                .ToList();

            var removeProcesses = part.Processes
                .Where(x => !requestUpdateProcessIds.Contains(x.Id))
                .ToList();

            foreach (var removeProcess in removeProcesses)
            {
                part.Processes.Remove(removeProcess);
            }

            // 5. Update existing processes
            foreach (var process in updateProcesses)
            {
                var existingProcess = part.Processes
                    .FirstOrDefault(x => x.Id == process.Id);

                if (existingProcess == null)
                    return Errors.Part.NotFoundProcess;

                existingProcess.Note = process.Note;
                existingProcess.MachineId = process.MachineId;
                existingProcess.PlanDate = process.PlanDate;
                existingProcess.UpdateBy = _currentUserService.UserId;
                existingProcess.UpdateAt = DateTime.Now;
                existingProcess.Status = process.Status;
            }

            // 6. Add new processes
            foreach (var process in newProcesses)
            {
                part.Processes.Add(new PartProcess
                {
                    CreateAt = DateTime.Now,
                    CreateBy = _currentUserService.UserId,
                    MachineId = process.MachineId,
                    Note = process.Note,
                    Status = process.Status,
                    PlanDate = process.PlanDate,
                });
            }

            part.Processes
                .OrderBy(p => p.PlanDate)
                .Select((p, index) => new { Process = p, Sequence = index + 1 })
                .ToList()
                .ForEach(x =>
                {
                    x.Process.Sequence = x.Sequence;
                });

            // 7. Save update
            part = await _partRepository.UpdateAsync(part);

            if (part == null)
                return Errors.Part.UpdateFalse;

            return _mapper.Map<PartResponse>(part);
        }
    }
}
