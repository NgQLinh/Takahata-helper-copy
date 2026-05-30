using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.Equipment.Commands
{
    public record CreateDeviceCommand() : IRequest<ErrorOr<CreateDeviceResponse>>;
}
