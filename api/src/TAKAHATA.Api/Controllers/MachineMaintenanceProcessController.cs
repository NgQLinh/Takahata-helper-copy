using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.MaintenanceProcess.Commands;
using TAKAHATA.Application.MaintenanceProcess.Queries;

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

        [HttpPost("search")]
        public async Task<IActionResult> Search(MachineMaintenanceProcessesQuery request)
        {
            var result = await _sender.Send(request);
            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete(DeleteMachineMaintenanceProcessCommand request)
        {
            var result = await _sender.Send(request);
            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("detail")]
        public async Task<IActionResult> QueryMaintenanceProcessCommand(DeleteMachineMaintenanceProcessCommand request)
        {
            var result = await _sender.Send(request);
            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
