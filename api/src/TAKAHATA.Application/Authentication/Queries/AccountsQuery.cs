using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Authentication;

namespace TAKAHATA.Application.Authentication.Queries
{
    public record AccountsQuery : IRequest<ErrorOr<IEnumerable<AcountResponse>>>;
}
