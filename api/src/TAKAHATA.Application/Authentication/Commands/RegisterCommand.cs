using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Authentication;

namespace TAKAHATA.Application.Authentication.Commands
{
    public record RegisterCommand(string Email, string Password, string FullName) : IRequest<ErrorOr<RegisterResponse>>;
}
