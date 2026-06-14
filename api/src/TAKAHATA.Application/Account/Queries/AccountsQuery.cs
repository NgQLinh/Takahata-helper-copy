using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Account;

namespace TAKAHATA.Application.Account.Queries
{
    public record AccountsQuery : IRequest<ErrorOr<IEnumerable<AcountResponse>>>;
}
