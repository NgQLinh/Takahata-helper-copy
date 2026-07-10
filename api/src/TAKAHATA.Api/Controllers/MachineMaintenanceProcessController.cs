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

        [HttpPost("search")]
        public async Task<IActionResult> Search(MachineMaintenanceProcessesQuery request)
        {
            var result = await _sender.Send(request);
            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateMachineMaintenanceProcessCommand request)
        {
            var result = await _sender.Send(request);
            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update(UpdateMachineMaintenanceProcessCommand request)
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
        public async Task<IActionResult> GetMaintenanceProcessCommand(MachineMaintenanceProcessQuery request)
        {
            var result = await _sender.Send(request);
            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
