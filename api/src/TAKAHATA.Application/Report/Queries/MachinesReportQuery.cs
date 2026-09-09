using ErrorOr;
using MediatR;
using TAKAHATA.Contracts.Report;

namespace TAKAHATA.Application.Report.Queries
{
    public record MachinesReportQuery(string SearchMachineKeyword, DateTime From, DateTime To) : IRequest<ErrorOr<MachineReportResponse>>;
}
