using ErrorOr;
using MediatR;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record DeleteMachineCommand(int Id) : IRequest<ErrorOr<Machine>>;
}
