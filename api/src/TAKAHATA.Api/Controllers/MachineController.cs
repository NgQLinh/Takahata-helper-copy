using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Equipment.Commands;
using TAKAHATA.Application.Equipment.Queries;

namespace TAKAHATA.Api.Controllers
{
    public class MachineController : ApiController
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public MachineController(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMachine(CreateMachineCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateMachine(UpdateMachineCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteMachine(DeleteMachineCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query-machines")]
        public async Task<IActionResult> GetMachines()
        {
            var query = new MachineQuery();

            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query-machines-schedule")]
        public async Task<IActionResult> GetMachinesSchedule(MachineScheduleQuery request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
