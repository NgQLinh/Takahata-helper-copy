using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Report.Queries;

namespace TAKAHATA.Api.Controllers
{
    public class ReportController : ApiController
    {
        private ISender _sender;

        public ReportController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("machines-report-query")]
        public async Task<IActionResult> SearchMachinesReport(MachinesReportQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
