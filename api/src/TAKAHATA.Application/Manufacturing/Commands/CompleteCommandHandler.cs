using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class CompleteCommandHandler : IRequestHandler<CompleteCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        private readonly IPartProcessRepository _partProcessRepository;
        public CompleteCommandHandler(IPartProcessRepository partProcessRepository)
        {
            _partProcessRepository = partProcessRepository;
        }

        public async Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            CompleteCommand request,
            CancellationToken cancellationToken)
        {
            // TODO
            var partId = request.PartId;
            var machineId = request.MachineId;
            var processId = request.ProcessId;

            var partProcess = await _partProcessRepository.GetByIdAsync(request.ProcessId);
            if (partProcess == null)
                return Errors.Part.NotFoundProcess;

            partProcess.Status = ProcessStatus.Completed;
            partProcess = await _partProcessRepository.UpdateAsync(partProcess);

            if (partProcess == null)
                return Errors.Part.UpdatePartProcessFalse;

            return new ManufacturingProcessResponse
            {
                Id = partProcess.Id,
            };
        }
    }
}
