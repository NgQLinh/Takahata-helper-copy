using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class PauseCommandHandler : IRequestHandler<PauseCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        private readonly IPartProcessRepository _partProcessRepository;

        public PauseCommandHandler(IPartProcessRepository partProcessRepository)
        {
            _partProcessRepository = partProcessRepository;
        }

        public async Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            PauseCommand request,
            CancellationToken cancellationToken)
        {
            var partProcess = await _partProcessRepository.GetByIdAsync(request.ProcessId);
            if (partProcess == null)
                return Errors.Part.NotFoundProcess;

            partProcess.Status = ProcessStatus.Paused;
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
