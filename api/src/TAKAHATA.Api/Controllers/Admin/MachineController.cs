using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Api.Controllers.Common;
using TAKAHATA.Application.Equipment.Commands;
using TAKAHATA.Application.Equipment.Queries;
using TAKAHATA.Domain.Common.Constant;

namespace TAKAHATA.Api.Controllers.Admin
{

    public class MachineController : ApiController
    {
        private readonly ISender _sender;

        public MachineController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("create")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateMachine(CreateMachineCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("update")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> UpdateMachine(UpdateMachineCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("delete")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeleteMachine(DeleteMachineCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query-machines")]
        [Authorize(Roles = $"{Role.Admin}, {Role.User}")]
        public async Task<IActionResult> GetMachines()
        {
            var result = await _sender.Send(new AllMachinesQuery());

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("search")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> Search(MachinesQuery request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query-machines-schedule")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> GetMachinesSchedule(MachineScheduleQuery request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
