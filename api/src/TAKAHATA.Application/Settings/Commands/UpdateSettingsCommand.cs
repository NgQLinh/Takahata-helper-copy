using ErrorOr;
using MediatR;

namespace TAKAHATA.Application.Settings.Commands
{
    public record UpdateSettingsCommand(string IpAddress, int Port) : IRequest<ErrorOr<bool>>;
}
