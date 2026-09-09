using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.MaintenanceProcess;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.MaintenanceProcess.Commands
{
    public class UpdateMachineMaintenanceProcessCommandHandler : IRequestHandler<UpdateMachineMaintenanceProcessCommand, ErrorOr<MachineMaintenanceProcessResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMachineMaintenanceProcessRepository _machineMaintenanceProcessRepository;

        public UpdateMachineMaintenanceProcessCommandHandler(
            IMapper mapper,
            ICurrentUserService currentUserService,
            IMachineMaintenanceProcessRepository machineMaintenanceProcessRepository)
        {
            _mapper = mapper;
            _currentUserService = currentUserService;
            _machineMaintenanceProcessRepository = machineMaintenanceProcessRepository;
        }

        public async Task<ErrorOr<MachineMaintenanceProcessResponse>> Handle(
            UpdateMachineMaintenanceProcessCommand request,
            CancellationToken cancellationToken)
        {
            var machineMaintenanceProcess = await _machineMaintenanceProcessRepository.GetByIdAsync(request.Id);

            if (machineMaintenanceProcess == null)
                return Errors.MachineMaintenanceProcess.NotFound;

            // Update property
            machineMaintenanceProcess.UpdateBy = _currentUserService.UserId;
            machineMaintenanceProcess.UpdateAt = DateTime.Now;

            machineMaintenanceProcess.PlantDate = request.PlantDate;
            machineMaintenanceProcess.StartTime = request.StartTime;
            machineMaintenanceProcess.EndTime = request.EndTime;
            machineMaintenanceProcess.MachineId = request.MachineId;
            machineMaintenanceProcess.Note = request.Note;
            machineMaintenanceProcess.Status = request.Status;
            machineMaintenanceProcess.PerformedBy = request.PerformedBy;
            machineMaintenanceProcess.EstimatedTime = request.EstimatedTime;

            machineMaintenanceProcess = await _machineMaintenanceProcessRepository.UpdateAsync(machineMaintenanceProcess);

            if (machineMaintenanceProcess == null)
                return Errors.MachineMaintenanceProcess.UpdateMachineMaintenanceProcessFalse;

            return _mapper.Map<MachineMaintenanceProcessResponse>(machineMaintenanceProcess);
        }
    }
}
