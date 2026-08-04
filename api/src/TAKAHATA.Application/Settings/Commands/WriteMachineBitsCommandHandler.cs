using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.Settings.Commands
{
    public class WriteMachineBitsCommandHandler : IRequestHandler<WriteMachineBitsCommand, ErrorOr<bool>>
    {
        private readonly IPLCService _pLCService;

        public WriteMachineBitsCommandHandler(IPLCService pLCService)
        {
            _pLCService = pLCService;
        }

        public async Task<ErrorOr<bool>> Handle(WriteMachineBitsCommand request, CancellationToken cancellationToken)
        {
            var result = await _pLCService.WriteMachineData(
                   request.StatusBitAddress,
                   request.PartBitAddress,
                   request.PartProcessBitAddress,
                   (int)request.StatusValue,
                   request.PartValue,
                   request.PartProcessValue);

            if (result.IsSuccess)
                return true;
            else
                return Errors.Settings.OperationFailed;
        }
    }
}
