using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Common.Interface.Influx.Repositories;
using TAKAHATA.Application.DataLog.Queries;
using TAKAHATA.Domain.DataLog;

namespace TAKAHATA.Api.Controllers;


[AllowAnonymous]
public class MachineLogController : ApiController
{
    private readonly ISender _sender;
    private readonly IMachineLogRepository _machineLogRepository;

    public MachineLogController(
        IMachineLogRepository machineLogRepository, ISender sender)
    {
        _machineLogRepository = machineLogRepository;
        _sender = sender;
    }

    [HttpPost]
    public async Task<IActionResult> InsertAsync(
        [FromBody] MachineLog machineLog)
    {
        await _machineLogRepository.InsertAsync(machineLog);

        return Ok();
    }

    [HttpPost("batch")]
    public async Task<IActionResult> InsertBatchAsync(
        [FromBody] List<MachineLog> machineLogs)
    {
        await _machineLogRepository.InsertAsync(machineLogs);

        return Ok();
    }

    [HttpPost("latest")]
    public async Task<IActionResult> GetLatestAsync(MachineLogsQuery request)
    {
        var result = await _sender.Send(request);

        return result.Match(
            r => Ok(r),
            e => Problem(e));
    }

    [HttpGet("latest/{machineId:long}")]
    public async Task<IActionResult> GetLatestAsync(long machineId)
    {
        var result = await _machineLogRepository.GetLatestAsync(machineId);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("history/{machineId:long}")]
    public async Task<IActionResult> GetHistoryAsync(
        long machineId,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        var result = await _machineLogRepository.GetHistoryAsync(
            machineId,
            from,
            to);

        return Ok(result);
    }
}