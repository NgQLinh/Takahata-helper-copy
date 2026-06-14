using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Authentication;

namespace TAKAHATA.Application.Authentication.Commands
{
    public record RefreshCommand(string RefreshToken, string AccessToken) : IRequest<ErrorOr<LoginResponse>>;
}
