using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.IndexAndPart.Queries;
using TAKAHATA.Domain.Common.Constant;

namespace TAKAHATA.Api.Controllers
{
    [Authorize(Roles = Role.Admin)]
    public class IndexController : ApiController
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public IndexController(ISender sender, IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search(SearchIndexQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }
    }
}
