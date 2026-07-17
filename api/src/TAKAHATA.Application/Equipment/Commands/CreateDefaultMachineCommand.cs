using ErrorOr;
using MediatR;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record CreateDefaultMachineCommand(bool need) : IRequest<ErrorOr<bool>>;
}
