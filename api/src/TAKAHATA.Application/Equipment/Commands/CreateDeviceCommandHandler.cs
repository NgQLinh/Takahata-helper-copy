using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class CreateDeviceCommandHandler : IRequestHandler<CreateDeviceCommand, ErrorOr<Machine>>
    {
        private readonly IMapper _mapper;

        private readonly IDeviceRepository _deviceRepository;

        public CreateDeviceCommandHandler(IDeviceRepository deviceRepository, IMapper mapper)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
        }

        public async Task<ErrorOr<Machine>> Handle(CreateDeviceCommand command, CancellationToken cancellationToken)
        {
            var device = _mapper.Map<Machine>(command);

            device = await _deviceRepository.AddDeviceAsync(device);

            if (device is null)
                return Errors.Device.CreateDeviceFalse;

            return device;
        }
    }
}
