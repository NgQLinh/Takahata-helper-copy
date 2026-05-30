using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.User;
using TAKAHATA.Contracts.Equipment;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class CreateDeviceCommandHandler : IRequestHandler<CreateDeviceCommand, ErrorOr<Device>>
    {
        private readonly IMapper _mapper;

        private readonly IDeviceRepository _deviceRepository;

        public CreateDeviceCommandHandler(IDeviceRepository deviceRepository, IMapper mapper)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
        }

        public async Task<ErrorOr<Device>> Handle(CreateDeviceCommand command, CancellationToken cancellationToken)
        {
            var device = _mapper.Map<Device>(command);

            device = await _deviceRepository.AddDeviceAsync(device);

            if (device is null)
                return Errors.Device.CreateDeviceFalse;

            return device;
        }
    }
}
