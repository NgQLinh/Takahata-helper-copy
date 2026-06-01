using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TAKAHATA.Application.Equipment.Commands;
using TAKAHATA.Application.Equipment.Queries;
using TAKAHATA.Contracts.Equipment;

namespace TAKAHATA.Api.Controllers
{
    public class DeviceController : ApiController
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public DeviceController(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateDeviceRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new CreateDeviceCommand(
                request.Name,
                request.Type,
                request.SerialNumber,
                request.Brand,
                userId);

            var result = await _sender.Send(command);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateDevice(UpdateDeviceRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new UpdateDeviceCommand(
                request.Id,
                request.Name,
                request.Type,
                request.SerialNumber,
                request.Brand,
                userId);

            var result = await _sender.Send(command);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteDevice(DeleteDeviceRequest request)
        {
            var command = _mapper.Map<DeleteDeviceCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("devices")]
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
