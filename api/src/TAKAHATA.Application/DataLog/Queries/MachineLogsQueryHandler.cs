using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.DataLog.Queries
{
    public class MachineLogsQueryHandler : IRequestHandler<MachineLogsQuery, ErrorOr<IEnumerable<MachineLogResponse>>>
    {
        private readonly IPartRepository _partRepository;
        private readonly IMachineRepository _machineRepository;
        private readonly IMachineLogRepository _machineLogRepository;
        private readonly IMapper _mapper;

        public MachineLogsQueryHandler(
            IPartRepository partRepository,
            IMachineRepository machineRepository,
            IMachineLogRepository machineLogRepository,
            IMapper mapper)
        {
            _partRepository = partRepository;
            _machineRepository = machineRepository;
            _machineLogRepository = machineLogRepository;
            _mapper = mapper;
        }

        public async Task<ErrorOr<IEnumerable<MachineLogResponse>>> Handle(
            MachineLogsQuery request,
            CancellationToken cancellationToken)
        {
            var machines = await _machineRepository.GetAsync();

            if (machines == null || machines == null)
                return [];

            var partIds = machines
                .ToList()
                .Select(x => x.PartId)
                .ToHashSet();

            var parts = await _partRepository.GetByIdsAsync(partIds);

            var partDictionary = parts.ToDictionary(p => p.Id);
            var machineDictionary = machines.ToDictionary(m => m.Id);

            var response = machines.Select(log => new MachineLogResponse
            {
                Id = log.Id,
                PartId = log.PartId,
                MachineStatus = log.MachineStatus,
                MachineStatusChangeAt = log.MachineStatusChangeAt,

                Part = partDictionary.TryGetValue(log.PartId, out var part)
                    ? _mapper.Map<PartResponse>(part)
                    : null,
            }).ToList();

            return response;
        }
    }
}
