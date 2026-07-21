using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Services;

namespace TAKAHATA.Application.Settings.Commands
{
    public class UpdateSettingsCommandHandler : IRequestHandler<UpdateSettingsCommand, ErrorOr<bool>>
    {
        private readonly IPLCSettingsService _pLCSettingsService;

        public UpdateSettingsCommandHandler(IPLCSettingsService pLCSettingsService)
        {
            _pLCSettingsService = pLCSettingsService;
        }

        public async Task<ErrorOr<bool>> Handle(
            UpdateSettingsCommand request,
            CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            _pLCSettingsService.Update(request.IpAddress, request.Port);
            return true;
        }
    }
}
