using ErrorOr;
using MediatR;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record CreateMachineCommand(
        string Name,
        string Type,
        string Code,
        string Brand,
        int BitAddress) : IRequest<ErrorOr<Machine>>;
}
