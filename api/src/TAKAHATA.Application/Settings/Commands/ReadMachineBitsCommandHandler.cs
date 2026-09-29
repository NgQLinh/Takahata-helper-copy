using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Contracts.Settings;
using TAKAHATA.Domain.Common.Errors;

namespace TAKAHATA.Application.Settings.Commands
{
    public class ReadMachineBitsCommandHandler : IRequestHandler<ReadMachineBitsCommand, ErrorOr<ReadMachineBitsResponse>>
    {
        private readonly IPLCService _pLCService;

        public ReadMachineBitsCommandHandler(IPLCService pLCService)
        {
            _pLCService = pLCService;
        }

        public async Task<ErrorOr<ReadMachineBitsResponse>> Handle(ReadMachineBitsCommand request, CancellationToken cancellationToken)
        {
            var result = await _pLCService.ReadMachineData(
                request.StatusBitAddress,
                request.PartBitAddress,
                request.PartProcessBitAddress,
                request.ProcessStatusBitAddress);

            if (result.IsSuccess && result.Value != null)
                return result.Value;
            else
                return Errors.Settings.OperationFailed;
        }
    }
}
