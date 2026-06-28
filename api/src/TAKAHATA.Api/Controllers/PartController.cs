using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.IndexAndPart.Commands;
using TAKAHATA.Contracts.IndexAndPart;

namespace TAKAHATA.Api.Controllers
{
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
                r => Ok(_mapper.Map<PartResponse>(r)),
                e => Problem(e));
        }
    }
}
