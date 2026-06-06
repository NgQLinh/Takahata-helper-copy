using ErrorOr;
using MediatR;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record DeleteDeviceCommand(long Id) : IRequest<ErrorOr<Machine>>;
}
