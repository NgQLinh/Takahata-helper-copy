using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Application.Settings.Commands;

namespace TAKAHATA.Api.Controllers
{
    public class SettingsController : ApiController
    {
        private readonly ISender _sender;
        private readonly IPLCSettingsService _pLCSettingsService;

        public SettingsController(
            ISender sender,
            IPLCSettingsService pLCSettingsService)
        {
            _sender = sender;
            _pLCSettingsService = pLCSettingsService;
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update(UpdateSettingsCommand request)
        {
            var result = await _sender.Send(request);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("query")]
        public async Task<IActionResult> Query()
        {
            var response = new
            {
                IpAddress = _pLCSettingsService.GetIpAddress(),
                Port = _pLCSettingsService.GetPort(),
            };

            return Ok(response);
        }
    }
}
