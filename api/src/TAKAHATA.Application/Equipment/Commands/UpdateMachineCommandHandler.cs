using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class UpdateMachineCommandHandler : IRequestHandler<UpdateMachineCommand, ErrorOr<Machine>>
    {
        private readonly IMachinePollingManager _polling;
        private readonly IMachineRepository _machineRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdateMachineCommandHandler(
            IMachineRepository machineRepository,
            ICurrentUserService currentUserService,
            IMachinePollingManager polling)
        {
            _machineRepository = machineRepository;
            _currentUserService = currentUserService;
            _polling = polling;
        }

        public async Task<ErrorOr<Machine>> Handle(UpdateMachineCommand command, CancellationToken cancellationToken)
        {

            if (await _machineRepository.IsExistedExceptIdAsync(command.Name, command.Code, command.Id))
                return Errors.Machine.DuplicateMachine;

            var entity = await _machineRepository.GetByIdAsync(command.Id);
            if (entity == null)
                return Errors.Machine.NotFound;

            entity.Name = command.Name;
            entity.Type = command.Type;
            entity.Code = command.Code;
            entity.Brand = command.Brand;
            entity.UpdateBy = _currentUserService.UserId;
            entity.UpdateAt = DateTime.Now;
            entity.IsAutomatic = command.IsAutomatic;

            if (command.IsAutomatic)
            {
                entity.StatusBitAddress = command.StatusBitAddress ?? 0;
                entity.PartBitAddress = command.PartBitAddress ?? 0;
                entity.PartProcessBitAddress = command.PartProcessBitAddress ?? 0;
            }
            else
            {
                entity.PartBitAddress = 0;
                entity.PartProcessBitAddress = 0;
                entity.StatusBitAddress = 0;
            }


            entity = await _machineRepository.UpdateAsync(entity);
            if (entity == null)
                return Errors.Machine.UpdateFalse;

            _polling.RequestReload();

            return entity;
        }
    }
}
