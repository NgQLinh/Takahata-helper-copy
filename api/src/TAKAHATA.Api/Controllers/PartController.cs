using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.IndexAndPart.Commands;

namespace TAKAHATA.Api.Controllers
{
    [AllowAnonymous]
    public class PartController : ApiController
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public PartController(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePart(CreatePartCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
