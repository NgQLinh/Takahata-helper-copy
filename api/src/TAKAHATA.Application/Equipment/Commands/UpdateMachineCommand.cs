using ErrorOr;
using MediatR;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record UpdateMachineCommand(
        int Id,
        string Name,
        string Type,
        string Code,
        string Brand,
        bool IsAutomatic,
        int? StatusBitAddress,
        int? PartBitAddress,
        int? PartProcessBitAddress) : IRequest<ErrorOr<Machine>>;
}
