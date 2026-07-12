using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.Equipment.Queries
{
    public record MachinesQuery(string Keyword, int Page, int PageSize) : IRequest<ErrorOr<SearchResponse<List<MachineResponse>>>>;
}
