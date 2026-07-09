using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.MaintenanceProcess.Commands;

namespace TAKAHATA.Api.Controllers
{
    public class MachineMaintenanceProcessController : ApiController
    {
        private readonly ISender _sender;

        public MachineMaintenanceProcessController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMachineMaintenanceProcess(CreateMachineMaintenanceProcessCommand request)
        {
            var result = await _sender.Send(request);
            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
