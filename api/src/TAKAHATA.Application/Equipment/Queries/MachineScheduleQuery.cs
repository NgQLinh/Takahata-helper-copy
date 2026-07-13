using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Common;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Application.Equipment.Queries
{
    public record MachineScheduleQuery(
        string Keyword,
        DateOnly? PlantFrom,
        DateOnly? PlantTo,
        int Page,
        int PageSize) : IRequest<ErrorOr<SearchResponse<List<MachineScheduleResponse>>>>;
}
