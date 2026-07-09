using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.MaintenanceProcess;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Queries
{
    public class MachineMaintenanceProcessQueryHandler : IRequestHandler<MachineMaintenanceProcessQuery, ErrorOr<SearchResponse<MachineMaintenanceProcess>>>
    {
        private readonly IMapper _mapper;
        private readonly IMachineMaintenanceProcessRepository _machineMaintenanceProcessRepository;

        public MachineMaintenanceProcessQueryHandler(
            IMapper mapper,
            IMachineMaintenanceProcessRepository machineMaintenanceProcessRepository)
        {
            _mapper = mapper;
            _machineMaintenanceProcessRepository = machineMaintenanceProcessRepository;
        }

        public async Task<ErrorOr<SearchResponse<MachineMaintenanceProcess>>> Handle(MachineMaintenanceProcessQuery request, CancellationToken cancellationToken)
        {
            return await _machineMaintenanceProcessRepository.SearchAsync(
                 request.MachineIds,
                 request.From,
                 request.To,
                 request.Page,
                 request.PageSize);
        }
    }
}
