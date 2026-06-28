using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class UpdateMachineCommandHandler : IRequestHandler<UpdateMachineCommand, ErrorOr<Machine>>
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdateMachineCommandHandler(
            IDeviceRepository deviceRepository,
            ICurrentUserService currentUserService)
        {
            _deviceRepository = deviceRepository;
            _currentUserService = currentUserService;
        }

        public async Task<ErrorOr<Machine>> Handle(UpdateMachineCommand command, CancellationToken cancellationToken)
        {
            var entity = await _deviceRepository.GetByIdAsync(command.Id);
            if (entity == null)
                return Errors.Machine.NotFound;

            entity.Name = command.Name;
            entity.Type = command.Type;
            entity.Code = command.Code;
            entity.Brand = command.Brand;
            entity.UpdateBy = _currentUserService.UserId;
            entity.UpdateAt = DateTime.Now;
            entity.BitAddress = command.BitAddress;

            entity = await _deviceRepository.UpdateAsync(entity);
            if (entity == null)
                return Errors.Machine.UpdateMachineFalse;

            return entity;
        }
    }
}
