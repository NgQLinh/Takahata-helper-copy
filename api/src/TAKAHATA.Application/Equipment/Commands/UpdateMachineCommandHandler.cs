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
        private readonly IMachineRepository _machineRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdateMachineCommandHandler(
            IMachineRepository machineRepository,
            ICurrentUserService currentUserService)
        {
            _machineRepository = machineRepository;
            _currentUserService = currentUserService;
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
            entity.StatusBitAddress = command.BitAddress;

            entity = await _machineRepository.UpdateAsync(entity);
            if (entity == null)
                return Errors.Machine.UpdateMachineFalse;

            return entity;
        }
    }
}
