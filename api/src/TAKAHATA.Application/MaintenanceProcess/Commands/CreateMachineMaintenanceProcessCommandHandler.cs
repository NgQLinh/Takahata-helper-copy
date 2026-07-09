using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.MaintenanceProcess;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public class CreateMachineMaintenanceProcessCommandHandler : IRequestHandler<CreateMachineMaintenanceProcessCommand, ErrorOr<MachineMaintenanceProcessResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMachineMaintenanceProcessRepository _machineMaintenanceProcessRepository;

        public CreateMachineMaintenanceProcessCommandHandler(
            IMapper mapper,
            ICurrentUserService currentUserService,
            IMachineMaintenanceProcessRepository machineMaintenanceProcessRepository)
        {
            _mapper = mapper;
            _currentUserService = currentUserService;
            _machineMaintenanceProcessRepository = machineMaintenanceProcessRepository;
        }

        public async Task<ErrorOr<MachineMaintenanceProcessResponse>> Handle(
            CreateMachineMaintenanceProcessCommand request,
            CancellationToken cancellationToken)
        {
            var machineMaintenanceProcess = new MachineMaintenanceProcess
            {
                CreateBy = _currentUserService.UserId,
                ActualDate = request.ActualDate,
                PlanDate = request.PlanDate,
                MachineId = request.MachineId,
                Note = request.Note,
                WorkingHours = request.WorkingHours,
                Status = request.Status,
                PerformedBy = request.PerformedBy,
            };

            machineMaintenanceProcess = await _machineMaintenanceProcessRepository.AddAsync(machineMaintenanceProcess);

            if (machineMaintenanceProcess == null)
                return Errors.MachineMaintenanceProcessResponse.CreateMachineMaintenanceProcessResponseFalse;

            return _mapper.Map<MachineMaintenanceProcessResponse>(machineMaintenanceProcess);
        }
    }
}
