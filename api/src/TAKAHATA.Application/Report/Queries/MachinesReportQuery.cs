using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Report;

namespace TAKAHATA.Application.Report.Queries
{
    public record MachinesReportQuery(DateTime From, DateTime To) : IRequest<ErrorOr<MachineReportResponse>>;
}
