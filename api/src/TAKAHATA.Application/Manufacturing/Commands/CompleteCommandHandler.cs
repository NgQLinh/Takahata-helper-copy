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
        private readonly IPLCService _iPLCService;

        public CompleteCommandHandler(
            IPartProcessRepository partProcessRepository,
            ILogger<CompleteCommandHandler> logger,
            IMachineRepository machineRepository,
            IPLCService iPLCService)
        {
            _partProcessRepository = partProcessRepository;
            _logger = logger;
            _machineRepository = machineRepository;
            _iPLCService = iPLCService;
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

                if (result.IsSuccess)
                {
                    var partId = request.PartId;
                    var processId = request.ProcessId;

                    var partProcess = await _partProcessRepository.GetByIdAsync(request.ProcessId);
                    if (partProcess == null)
                        return Errors.Part.NotFoundProcess;

                    partProcess.Status = ProcessStatus.Completed;
                    partProcess.WaitingTime = request.WaitingTime;
                    partProcess.SetupTime = request.SetupTime;
                    partProcess.EndTime = DateTime.Now;
                    partProcess.ProcessedQuantity = request.ProcessedQuantity;
                    partProcess.PerformedBy = request.PerformedBy;
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
