using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.IndexAndPart;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Manufacturing.Commands
{
    public class StartCommandHandler : IRequestHandler<StartCommand, ErrorOr<ManufacturingProcessResponse>>
    {
        private readonly IPartProcessRepository _partProcessRepository;

        public StartCommandHandler(IPartProcessRepository partProcessRepository)
        {
            _partProcessRepository = partProcessRepository;
        }

        public async Task<ErrorOr<ManufacturingProcessResponse>> Handle(
            StartCommand request,
            CancellationToken cancellationToken)
        {
            var partProcess = await _partProcessRepository.GetByIdAsync(request.Id);
            if (partProcess == null)
                return Errors.Part.NotFoundProcess;

            partProcess.Status = ProcessStatus.InProgress;
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
