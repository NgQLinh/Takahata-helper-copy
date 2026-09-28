using ErrorOr;
using MapsterMapper;
using MediatR;
using TAKAHATA.Application.Common.Interface;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class CreateMachineCommandHandler : IRequestHandler<CreateMachineCommand, ErrorOr<Machine>>
    {
        private readonly IMapper _mapper;
        private readonly IMachineRepository _machineRepository;
        private readonly ICurrentUserService _currentUserService;

        public CreateMachineCommandHandler(
            IMachineRepository machineRepository,
            IMapper mapper,
            ICurrentUserService currentUserService)
        {
            _machineRepository = machineRepository;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }

        public async Task<ErrorOr<Machine>> Handle(CreateMachineCommand command, CancellationToken cancellationToken)
        {
            var machine = _mapper.Map<Machine>(command);
            machine.CreateBy = _currentUserService.UserId;

            if (!command.IsAutomatic)
            {
                machine.PartBitAddress = 0;
                machine.PartProcessBitAddress = 0;
                machine.StatusBitAddress = 0;
            }

            machine.IsAutomatic = command.IsAutomatic;

            if (await _machineRepository.IsExistedAsync(command.Name, command.Code))
                return Errors.Machine.DuplicateMachine;

            machine = await _machineRepository.AddAsync(machine);
            if (machine is null)
                return Errors.Machine.CreateFalse;

            return machine;
        }
    }
}
