using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Application.Settings.Commands
{
    public record WriteMachineBitsCommand(
        int StatusBitAddress,
        int PartBitAddress,
        int PartProcessBitAddress,
        int ProcessStatusBitAddress,
        MachineStatus StatusValue,
        int PartValue,
        int PartProcessValue,
        int ProcessStatusValue) : IRequest<ErrorOr<bool>>;
}
