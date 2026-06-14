using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Account;

namespace TAKAHATA.Application.Account.Commands
{
    public record DeleteAccountCommand(string Id) : IRequest<ErrorOr<AcountResponse>>;
}
