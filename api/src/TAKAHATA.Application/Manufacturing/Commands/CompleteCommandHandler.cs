using ErrorOr;
using MediatR;
using Microsoft.Extensions.Logging;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class CompleteCommandHandler : IRequestHandler<CompleteCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        private readonly ILogger<CompleteCommandHandler> _logger;
        private readonly IMachineRepository _machineRepository;
        private readonly IPartProcessRepository _partProcessRepository;
        private readonly IPartRepository _partRepository;
        private readonly IPLCService _iPLCService;

        public CompleteCommandHandler(
            IPartProcessRepository partProcessRepository,
            IPartRepository partRepository,
            ILogger<CompleteCommandHandler> logger,
            IMachineRepository machineRepository,
            IPLCService iPLCService)
        {
            _partProcessRepository = partProcessRepository;
            _logger = logger;
            _machineRepository = machineRepository;
            _iPLCService = iPLCService;
            _partRepository = partRepository;
        }

        public async Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            CompleteCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var machineId = request.MachineId;
                var machine = await _machineRepository.GetByIdAsync(machineId);

                if (machine == null)
                    return Errors.Machine.NotFound;

                // Ghi xuống PLC
                var result = await _iPLCService.WriteMachineData(machine, 0, 0);

                if (result.IsSuccess || !machine.IsAutomatic)
                {
                    var partId = request.PartId;
                    var processId = request.ProcessId;

                    var part = await _partRepository.GetByIdAsync(partId);
                    if (part == null)
                        return Errors.Part.NotFound;

                    var partProcess = await _partProcessRepository.GetByIdAsync(request.ProcessId);
                    if (partProcess == null)
                        return Errors.Part.NotFoundProcess;

                    if (request.ProcessedQuantity > part.Quantity)
                        return Errors.Part.IncorrectQuantity;

                    if (request.ProcessedQuantity == part.Quantity)
                        partProcess.Status = ProcessStatus.Completed;
                    else
                        partProcess.Status = ProcessStatus.PartiallyCompleted;

                    partProcess.WaitingTime = request.WaitingTime;
                    partProcess.SetupTime = request.SetupTime;
                    partProcess.EndTime = DateTime.Now;
                    partProcess.ProcessedQuantity = request.ProcessedQuantity;
                    partProcess.PerformedBy = request.PerformedBy;
                    partProcess.WorkerNote = request.WorkerNote;
                    if (machine.MachineType == Domain.Common.Enum.MachineType.Automatic)
                        partProcess.ProgrammingTime = request.ProgrammingTime;
                    else if (machine.MachineType == Domain.Common.Enum.MachineType.Manual)
                        partProcess.WorkingTime = request.MachineTime;

                    part.ProcessedQuantity += request.ProcessedQuantity;
                    part = await _partRepository.UpdateAsync(part);
                    if (part == null)
                        return Errors.Part.UpdateFalse;

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
                    return Errors.Part.CompletePartProcessFalse;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi không hoàn thành được process: {ex.Message}");
                return Errors.Part.CompletePartProcessFalse;
            }
        }
    }
}
