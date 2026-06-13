using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Authentication.Commands;
using TAKAHATA.Application.Authentication.Queries;
using TAKAHATA.Contracts.Authentication;

namespace TAKAHATA.Api.Controllers
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

        [HttpPost("create/")]
        public async Task<IActionResult> CreateAccount(RegisterRequest request)
        {
            var command = _mapper.Map<CreateAccountCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(r => Ok(r), e => Problem(e));
        }

        [HttpPost("login/")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var command = _mapper.Map<LoginCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(r => Ok(r), e => Problem(e));
        }

        [HttpPost("query-accounts")]
        public async Task<IActionResult> GetAccounts()
        {
            var query = new AccountsQuery();

            var result = await _sender.Send(query);

            return result.Match(r => Ok(r), e => Problem(e));
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateAccounts()
        {
            var query = new AccountsQuery();

            var result = await _sender.Send(query);

            return result.Match(r => Ok(r), e => Problem(e));
        }
    }
}
