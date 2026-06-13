using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Authentication;

namespace TAKAHATA.Application.Authentication.Commands
{
    public record CreateAccountCommand(string UserName, string Password, string FullName, string Role) : IRequest<ErrorOr<AcountResponse>>;
}
