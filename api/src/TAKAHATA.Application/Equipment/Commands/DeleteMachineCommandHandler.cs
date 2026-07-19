using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Equipment;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Domain.Common.Errors;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class DeleteMachineCommandHandler : IRequestHandler<DeleteMachineCommand, ErrorOr<Machine>>
    {
        private readonly IMachinePollingManager _polling;
        private readonly IMachineRepository _machineRepository;

        public DeleteMachineCommandHandler(
            IMachineRepository machineRepository,
            IMachinePollingManager polling)
        {
            _machineRepository = machineRepository;
            _polling = polling;
        }
        public async Task<ErrorOr<Machine>> Handle(DeleteMachineCommand command, CancellationToken cancellationToken)
        {
            var machine = await _machineRepository.DeleteByIdAsync(command.Id);

            if (machine == null)
                return Errors.Machine.NotFound;

            _polling.RequestReload();
            return machine;
        }
    }
}
