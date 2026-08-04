using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Application.Settings.Commands
{
    public record WriteMachineBitsCommand(
        int StatusBitAddress,
        int PartBitAddress,
        int PartProcessBitAddress,
        MachineStatus StatusValue,
        int PartValue,
        int PartProcessValue) : IRequest<ErrorOr<bool>>;
}
