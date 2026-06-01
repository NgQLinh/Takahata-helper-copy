using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class UpdateDeviceCommandHandler : IRequestHandler<UpdateDeviceCommand, ErrorOr<Device>>
    {
        private readonly IDeviceRepository _deviceRepository;

        public UpdateDeviceCommandHandler(IDeviceRepository deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }

        public async Task<ErrorOr<Device>> Handle(UpdateDeviceCommand command, CancellationToken cancellationToken)
        {
            var entity = await _deviceRepository.GetByIdAsync(command.Id);
            if (entity == null)
                return Errors.Device.NotFound;

            entity.Name = command.Name;
            entity.Type = command.Type;
            entity.SerialNumber = command.SerialNumber;
            entity.Brand = command.Brand;
            entity.UpdateBy = command.UpdateBy;
            entity.UpdateAt = DateTime.Now;

            entity = await _deviceRepository.UpdateAsync(entity);
            if (entity == null)
                return Errors.Device.UpdateDeviceFalse;

            return entity;
        }
    }
}
