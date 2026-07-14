using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public class PartProcessesOfMachineQueryHandler : IRequestHandler<PartProcessesOfMachineQuery, ErrorOr<IEnumerable<PartProcessResponse>>>
    {
        private readonly IMapper _mapper;

        private readonly IPartProcessRepository _partProcessRepository;

        public PartProcessesOfMachineQueryHandler(
            IMapper mapper,
            IPartProcessRepository partProcessRepository)
        {
            _mapper = mapper;
            _partProcessRepository = partProcessRepository;
        }

        public async Task<ErrorOr<IEnumerable<PartProcessResponse>>> Handle(
            PartProcessesOfMachineQuery request,
            CancellationToken cancellationToken)
        {
            var partProcesses = await _partProcessRepository
                .GetByMachineIdAsync(request.MachineId);

            return partProcesses
                 .Select(p => _mapper.Map<PartProcessResponse>(p))
                 .ToList();
        }
    }
}
