using ErrorOr;
using MediatR;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record DeleteMachineCommand(long Id) : IRequest<ErrorOr<Machine>>;
}
