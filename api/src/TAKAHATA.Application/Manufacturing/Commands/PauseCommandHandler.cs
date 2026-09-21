using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class PauseCommandHandler : IRequestHandler<PauseCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        private readonly IMachineRepository _machineRepository;
        private readonly IPartProcessRepository _partProcessRepository;
        private readonly IPLCService _iPLCService;
        private readonly IPartRepository _partRepository;

        public PauseCommandHandler(
            IPartProcessRepository partProcessRepository,
            IMachineRepository machineRepository,
            IPLCService iPLCService,
            IPartRepository partRepository)
        {
            _partProcessRepository = partProcessRepository;
            _machineRepository = machineRepository;
            _iPLCService = iPLCService;
            _partRepository = partRepository;
        }

        public async Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            PauseCommand request,
            CancellationToken cancellationToken)
        {
            var machineId = request.MachineId;
            var machine = await _machineRepository.GetByIdAsync(machineId);

            if (machine == null)
                return Errors.Machine.NotFound;

            // Ghi xuống PLC
            var result = await _iPLCService.WriteMachineData(machine, 0, 0);

            if (result.IsSuccess || !machine.IsAutomatic)
            {
                var partProcess = await _partProcessRepository.GetByIdAsync(request.ProcessId);
                if (partProcess == null)
                    return Errors.Part.NotFoundProcess;

                var part = await _partRepository.GetByIdAsync(request.PartId);
                if (part == null)
                    return Errors.Part.NotFound;

                if (request.ProcessedQuantity > part.Quantity)
                    return Errors.Part.IncorrectQuantity;

                partProcess.Status = ProcessStatus.Paused;
                // Cộng dồn thời gian
                if (partProcess.WaitingTime.HasValue)
                    partProcess.WaitingTime += request.WaitingTime;
                else
                    partProcess.WaitingTime = request.WaitingTime;

                if (partProcess.SetupTime.HasValue)
                    partProcess.SetupTime += request.SetupTime;
                else
                    partProcess.SetupTime = request.SetupTime;

                partProcess.EndTime = DateTime.Now;

                // Nếu số lượng > kế hoạch tự động set bằng
                partProcess.ProcessedQuantity += request.ProcessedQuantity;
                if (partProcess.ProcessedQuantity > part.Quantity)
                    partProcess.ProcessedQuantity = part.Quantity;

                partProcess.PerformedBy = request.PerformedBy;
                if (!string.IsNullOrEmpty(request.WorkerNote))
                    partProcess.WorkerNote = request.WorkerNote;

                if (machine.IsAutomatic)
                {
                    if (partProcess.ProgrammingTime.HasValue)
                        partProcess.ProgrammingTime += request.ProgrammingTime;
                    else
                        partProcess.ProgrammingTime = request.ProgrammingTime;
                }
                else
                {
                    if (partProcess.WorkingTime.HasValue)
                        partProcess.WorkingTime += request.MachineTime;
                    else
                        partProcess.WorkingTime = request.MachineTime;
                }

                partProcess = await _partProcessRepository.UpdateAsync(partProcess);
                if (partProcess == null)
                    return Errors.Part.UpdatePartProcessFalse;

                return new ManufacturingProcessResponse
                {
                    Id = partProcess.Id,
                };
            }
            else
            {
                return Errors.Part.PausePartProcessFalse;
            }
        }
    }
}
