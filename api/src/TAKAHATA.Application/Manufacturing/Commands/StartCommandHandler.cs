using ErrorOr;
using MediatR;
using Microsoft.Extensions.Logging;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class StartCommandHandler : IRequestHandler<StartCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        private readonly ILogger<StartCommandHandler> _logger;
        private readonly IPartProcessRepository _partProcessRepository;
        private readonly IMachineRepository _machineRepository;

        public StartCommandHandler(
            IPartProcessRepository partProcessRepository,
            ILogger<StartCommandHandler> logger,
            IMachineRepository machineRepository)
        {
            _logger = logger;
            _partProcessRepository = partProcessRepository;
            _machineRepository = machineRepository;
        }

        public async Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            StartCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"Bắt đầu quá trình gia công");
                var machineId = request.MachineId;
                var machine = await _machineRepository.GetByIdAsync(machineId);

                if (machine == null)
                    return Errors.Machine.NotFound;

                // Ghi xuống PLC

                var partId = request.PartId;

                var processId = request.ProcessId;

                var partProcess = await _partProcessRepository.GetByIdAsync(request.ProcessId);
                if (partProcess == null)
                    return Errors.Part.NotFoundProcess;

                partProcess.Status = ProcessStatus.InProgress;
                partProcess.StartTime = DateTime.Now;
                partProcess = await _partProcessRepository.UpdateAsync(partProcess);

                if (partProcess == null)
                    return Errors.Part.UpdatePartProcessFalse;

                _logger.LogInformation($"Bắt đầu gia công thành công");

                return new ManufacturingProcessResponse
                {
                    Id = partProcess.Id,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi không bắt đầu được process: {ex.Message}");
                return Errors.Part.StartPartProcessFalse;
            }
        }
    }
}
