using ErrorOr;
using MediatR;
using TAKAHATA.Application.Common.Interface.Repositories;

namespace TAKAHATA.Application.Equipment.Commands
{
    public class CreateDefaultMachineCommandHandler : IRequestHandler<CreateDefaultMachineCommand, ErrorOr<bool>>
    {
        private readonly IMachineRepository _machineRepository;

        public CreateDefaultMachineCommandHandler(IMachineRepository machineRepository)
        {
            _machineRepository = machineRepository;
        }

        public async Task<ErrorOr<bool>> Handle(
            CreateDefaultMachineCommand request,
            CancellationToken cancellationToken)
        {
            if (!request.need)
                return false;

            await _machineRepository.CreateDefaultMachine();

            return true;
        }
    }
}
