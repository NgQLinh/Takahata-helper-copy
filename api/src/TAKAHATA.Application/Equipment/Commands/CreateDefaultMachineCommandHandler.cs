using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Application.Common.Interface.Services;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class CreateDefaultMachineCommandHandler : IRequestHandler<CreateDefaultMachineCommand, ErrorOr<bool>>
    {
        private readonly IMachineRepository _machineRepository;
        private readonly IMachinePollingManager _polling;

        public CreateDefaultMachineCommandHandler(
            IMachineRepository machineRepository,
            IMachinePollingManager polling)
        {
            _machineRepository = machineRepository;
            _polling = polling;
        }

        public async Task<ErrorOr<bool>> Handle(
            CreateDefaultMachineCommand request,
            CancellationToken cancellationToken)
        {
            if (!request.need)
                return false;

            await _machineRepository.CreateDefaultMachine();
            _polling.RequestReload();

            return true;
        }
    }
}
