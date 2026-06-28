using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public record PartQuery(long Id) : IRequest<ErrorOr<PartResponse>>;
}
