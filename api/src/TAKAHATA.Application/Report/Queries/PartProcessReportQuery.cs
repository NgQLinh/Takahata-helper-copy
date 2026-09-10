using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Report;

namespace TAKAHATA.Application.Report.Queries
{
    public record PartProcessReportQuery(
        string? SearchMachineKeyword,
        string? SearchIndexKeyword,
        string? SearchPartKeyword,
        DateTime From,
        DateTime To) : IRequest<ErrorOr<PartProcessReportResponse>>;
}
