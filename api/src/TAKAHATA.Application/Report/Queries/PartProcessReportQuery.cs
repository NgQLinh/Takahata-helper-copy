using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Report;

namespace TAKAHATA.Application.Report.Queries
{
    public record PartProcessReportQuery(DateTime From, DateTime To) : IRequest<ErrorOr<PartProcessReportResponse>>;
}
