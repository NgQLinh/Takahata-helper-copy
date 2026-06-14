using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Account.Commands;
using TAKAHATA.Application.Account.Queries;
using TAKAHATA.Contracts.Account;

namespace TAKAHATA.Api.Controllers
{
    public class AccountController : ApiController
    {
        private readonly ISender _sender;
        private readonly IMapper _mapper;

        public AccountController(
            ISender sender,
            IMapper mapper)
        {
            _sender = sender;
            _mapper = mapper;
        }

        [HttpPost("create/")]
        public async Task<IActionResult> CreateAccount(CreateAccountRequest request)
        {
            var command = _mapper.Map<CreateAccountCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(r => Ok(r), e => Problem(e));
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateAccounts(UpdateAccountRequest request)
        {
            var command = _mapper.Map<UpdateAccountCommand>(request);

            var result = await _sender.Send(command);

            return result.Match(r => Ok(r), e => Problem(e));
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteAccounts(DeleteAccountRequest request)
        {
            var command = _mapper.Map<DeleteAccountCommand>(request);

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
    }
}
