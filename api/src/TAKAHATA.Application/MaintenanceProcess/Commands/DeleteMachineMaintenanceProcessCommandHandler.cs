using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public class DeleteMachineMaintenanceProcessCommandHandler : IRequestHandler<DeleteMachineMaintenanceProcessCommand, ErrorOr<MachineMaintenanceProcessResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IMachineMaintenanceProcessRepository _machineMaintenanceProcessRepository;

        public DeleteMachineMaintenanceProcessCommandHandler(
            IMapper mapper,
            IMachineMaintenanceProcessRepository machineMaintenanceProcessRepository)
        {
            _mapper = mapper;
            _machineMaintenanceProcessRepository = machineMaintenanceProcessRepository;
        }

        public async Task<ErrorOr<MachineMaintenanceProcessResponse>> Handle(
            DeleteMachineMaintenanceProcessCommand request,
            CancellationToken cancellationToken)
        {
            var machineMaintenanceProcess = await _machineMaintenanceProcessRepository.DeleteByIdAsync(request.Id);

            if (machineMaintenanceProcess == null)
                return Errors.MachineMaintenanceProcess.DeleteMachineMaintenanceProcessFalse;

            return _mapper.Map<MachineMaintenanceProcessResponse>(machineMaintenanceProcess);
        }
    }
}
