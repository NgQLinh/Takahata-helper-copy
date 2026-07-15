using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Authentication.Commands;

namespace TAKAHATA.Api.Controllers.Common
{
    [AllowAnonymous]
    public class AuthenticationController : ApiController
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public AuthenticationController(
            ISender sender,
            IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }

        [HttpPost("login/")]
        public async Task<IActionResult> Login(LoginCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(r => Ok(r), e => Problem(e));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(r => Ok(r), e => Problem(e));
        }
    }
}
