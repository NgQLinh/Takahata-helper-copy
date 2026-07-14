using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.MaintenanceProcess.Queries;

namespace TAKAHATA.Api.Controllers
{
    public class ProcessController : ApiController
    {
        private ISender _sender;

        public ProcessController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("get-part-process-by-machine")]
        public async Task<IActionResult> GetPartProcessByMachine(PartProcessesOfMachineQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
