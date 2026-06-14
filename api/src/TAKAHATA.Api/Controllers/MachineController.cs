using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TAKAHATA.Application.Equipment.Commands;
using TAKAHATA.Application.Equipment.Queries;
using TAKAHATA.Contracts.Equipment;

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
        public async Task<IActionResult> Create(CreateMachineRequest request)
        {
            var command = _mapper.Map<CreateMachineCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateDevice(UpdateMachineRequest request)
        {
            var command = _mapper.Map<UpdateMachineCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteDevice(DeleteMachineRequest request)
        {
            var command = _mapper.Map<DeleteMachineCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query-machines")]
        public async Task<IActionResult> GetDevices()
        {
            var query = new DeviceQuery();

            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
