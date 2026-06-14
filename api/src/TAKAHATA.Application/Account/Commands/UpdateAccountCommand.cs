using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Account;

namespace TAKAHATA.Application.Account.Commands
{
    public record UpdateAccountCommand(string Id, string UserName, string Password, string FullName, string Role) : IRequest<ErrorOr<AcountResponse>>;
}
