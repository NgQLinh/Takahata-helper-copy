using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.DataLog.Queries;

namespace TAKAHATA.Api.Controllers;


[AllowAnonymous]
public class MachineLogController : ApiController
{
    private readonly ISender _sender;

    public MachineLogController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("latest")]
    public async Task<IActionResult> GetLatestAsync(MachineLogsQuery request)
    {
        var result = await _sender.Send(request);

        return result.Match(
            r => Ok(r),
            e => Problem(e));
    }
}