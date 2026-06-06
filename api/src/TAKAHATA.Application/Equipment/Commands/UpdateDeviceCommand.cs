using ErrorOr;
using MediatR;
using TAKAHATA.Domain.Common.Enum;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record UpdateDeviceCommand(
        long Id,
        string Name,
        MachineType Type,
        string SerialNumber,
        string Brand,
        string UpdateBy,
        int BitAddress) : IRequest<ErrorOr<Machine>>;
}
