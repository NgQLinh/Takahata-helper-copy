using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class CreateMachineCommandHandler : IRequestHandler<CreateMachineCommand, ErrorOr<Machine>>
    {
        private readonly IMapper _mapper;
        private readonly IDeviceRepository _deviceRepository;
        private readonly ICurrentUserService _currentUserService;


        public CreateMachineCommandHandler(
            IDeviceRepository deviceRepository,
            IMapper mapper,
            ICurrentUserService currentUserService)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<ErrorOr<Machine>> Handle(CreateMachineCommand command, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            if (string.IsNullOrEmpty(userId))
                return Errors.Machine.Unauthorized;

            var device = _mapper.Map<Machine>(command);
            device.CreateBy = userId;

            device = await _deviceRepository.AddAsync(device);
            if (device is null)
                return Errors.Machine.CreateMachineFalse;

            return device;
        }
    }
}
