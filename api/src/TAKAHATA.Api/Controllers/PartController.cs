using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.IndexAndPart.Commands;
using TAKAHATA.Application.IndexAndPart.Queries;
using TAKAHATA.Contracts.IndexAndPart;
using TAKAHATA.Domain.Common.Constant;

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
        [Authorize(Roles = $"{Role.Admin}, {Role.User}")]
        public async Task<IActionResult> CreatePart(CreatePartCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(_mapper.Map<PartResponse>(r)),
                e => Problem(e));
        }

        [HttpPost("update")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> UpdatePart(UpdatePartCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(_mapper.Map<PartResponse>(r)),
                e => Problem(e));
        }

        [HttpPost("delete")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> DeletePart(DeletePartCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query-parts")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> GetParts(PartsQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("detail")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> Detail(PartQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("approve")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> Approve(ApproveCommand command)
        {
            var result = await _sender.Send(command);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
