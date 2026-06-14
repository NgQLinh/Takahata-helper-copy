using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record CreateMachineCommand(
        string Name,
        MachineType Type,
        string Code,
        string Brand,
        int BitAddress) : IRequest<ErrorOr<Machine>>;
}
