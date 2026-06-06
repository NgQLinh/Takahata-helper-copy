using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record CreateDeviceCommand(
        string Name,
        MachineType Type,
        string SerialNumber,
        string Brand,
        string CreateBy,
        int BitAddress) : IRequest<ErrorOr<Machine>>;
}
