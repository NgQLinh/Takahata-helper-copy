using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.IndexAndPart.Queries
{
    public record PartsQuery(
        string? SearchText,
        List<ProcessStatus>? Statuses,
        DateOnly? PlantFrom,
        DateOnly? PlantTo,
        DateOnly? ActualFrom,
        DateOnly? ActualTo,
        int Page,
        int PageSize) : IRequest<ErrorOr<SearchResponse<List<PartResponse>>>>;
}
