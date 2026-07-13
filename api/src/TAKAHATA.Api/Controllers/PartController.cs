using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.IndexAndPart.Commands;
using TAKAHATA.Application.IndexAndPart.Queries;
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

        [HttpPost("update")]
        public async Task<IActionResult> UpdatePart(UpdatePartCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(_mapper.Map<PartResponse>(r)),
                e => Problem(e));
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeletePart(DeletePartCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query-parts")]
        public async Task<IActionResult> GetParts(PartsQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("detail")]
        public async Task<IActionResult> Detail(PartQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
