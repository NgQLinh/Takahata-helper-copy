using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class DeleteDeviceCommandHandler : IRequestHandler<DeleteDeviceCommand, ErrorOr<Machine>>
    {
        private readonly IDeviceRepository _deviceRepository;

        public DeleteDeviceCommandHandler(IDeviceRepository deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }
        public async Task<ErrorOr<Machine>> Handle(DeleteDeviceCommand command, CancellationToken cancellationToken)
        {
            var device = await _deviceRepository.DeleteDeviceByIdAsync(command.Id);

            if (device == null)
                return Errors.Device.NotFound;

            return device;
        }
    }
}
