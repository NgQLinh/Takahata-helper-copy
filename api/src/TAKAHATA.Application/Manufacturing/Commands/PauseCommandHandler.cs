using ErrorOr;
using MediatR;
using System.IO.Ports;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;
using static TAKAHATA.Domain.Common.Errors.Errors;

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
                partProcess.WaitingTime = request.WaitingTime;
                partProcess.SetupTime = request.SetupTime;
                partProcess.EndTime = DateTime.Now;
                partProcess.ProcessedQuantity = request.ProcessedQuantity;
                partProcess.PerformedBy = request.PerformedBy;
                partProcess.WorkerNote = request.WorkerNote;
                partProcess.ProgrammingTime = request.ProgrammingTime;

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
