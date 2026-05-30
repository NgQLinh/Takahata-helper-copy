using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            return Ok();
        }
    }
}
