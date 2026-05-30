using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Authentication.Commands;
using TAKAHATA.Contracts.Authentication;

namespace TAKAHATA.Api.Controllers
{
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

        [HttpPost("account-create/")]
        public async Task<IActionResult> CreateAccount(RegisterRequest request)
        {
            var command = _mapper.Map<RegisterCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(r => Ok(r), e => Problem(e));
        }

        [HttpPost("account-login/")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var command = _mapper.Map<LoginCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(r => Ok(r), e => Problem(e));
        }
    }
}
