using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.User;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class CreateDeviceCommandHandler : IRequestHandler<CreateDeviceCommand, ErrorOr<CreateDeviceResponse>>
    {
        private readonly IDeviceRepository  _deviceRepository;

        public CreateDeviceCommandHandler(IDeviceRepository deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }

        public Task<ErrorOr<CreateDeviceResponse>> Handle(CreateDeviceCommand request, CancellationToken cancellationToken)
        {

            throw new NotImplementedException();
        }
    }
}
