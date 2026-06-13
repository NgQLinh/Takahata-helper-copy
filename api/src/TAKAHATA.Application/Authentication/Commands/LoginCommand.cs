using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Authentication;

namespace TAKAHATA.Application.Authentication.Commands
{
    public record LoginCommand(string UserName, string Password) : IRequest<ErrorOr<LoginResponse>>;
}
