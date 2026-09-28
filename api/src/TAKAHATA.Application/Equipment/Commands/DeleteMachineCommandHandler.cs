using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class DeleteMachineCommandHandler : IRequestHandler<DeleteMachineCommand, ErrorOr<Machine>>
    {
        private readonly IMachineRepository _machineRepository;

        public DeleteMachineCommandHandler(IMachineRepository machineRepository)
        {
            _machineRepository = machineRepository;
        }
        public async Task<ErrorOr<Machine>> Handle(DeleteMachineCommand command, CancellationToken cancellationToken)
        {
            var machine = await _machineRepository.DeleteByIdAsync(command.Id);

            if (machine == null)
                return Errors.Machine.DeleteFalse;

            return machine;
        }
    }
}
