using MediatR;
using Microsoft.AspNetCore.Mvc;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Application.Report.Queries;

namespace TAKAHATA.Api.Controllers
{
    public class ReportController : ApiController
    {
        private ISender _sender;
        private IKpiExcelExportService _kpiExcelExportService;
        private const string ExcelContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        public ReportController(
            ISender sender,
            IKpiExcelExportService kpiExcelExportService)
        {
            _sender = sender;
            _kpiExcelExportService = kpiExcelExportService;
        }



        [HttpPost("machines-report-query")]
        public async Task<IActionResult> SearchMachinesReport(MachinesReportQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("part-process-report-query")]
        public async Task<IActionResult> SearchPartProcessReport(PartProcessReportQuery query)
        {
            var result = await _sender.Send(query);

            return result.Match(
                r => Ok(r),
                e => Problem(e));
        }

        [HttpPost("machines/export")]
        public async Task<IActionResult> MachinesExport(
         MachinesReportQuery query,
         CancellationToken cancellationToken)
        {
            if (query.To.Date < query.From.Date)
            {
                return BadRequest(
                    "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
            }

            var result = await _sender.Send(query, cancellationToken);

            return result.Match<IActionResult>(
                r =>
                {
                    var data = r.MachineKPIs ?? [];

                    var from = DateOnly.FromDateTime(query.From);
                    var to = DateOnly.FromDateTime(query.To);

                    var fileBytes = _kpiExcelExportService.ExportMachines(
                        data,
                        from,
                        to);

                    var fileName =
                        $"machine-kpi_{from:yyyyMMdd}_{to:yyyyMMdd}.xlsx";

                    return File(
                        fileBytes,
                        ExcelContentType,
                        fileName);
                },
                errors => Problem(errors));
        }

        [HttpPost("part-processes/export")]
        public async Task<IActionResult> PartProcessExport(
            PartProcessReportQuery query,
            CancellationToken cancellationToken)
        {
            if (query.To.Date < query.From.Date)
            {
                return BadRequest(
                    "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
            }

            var result = await _sender.Send(query, cancellationToken);

            return result.Match<IActionResult>(
                r =>
                {
                    var data = r.PartProcessKPIs ?? [];

                    var from = DateOnly.FromDateTime(query.From);
                    var to = DateOnly.FromDateTime(query.To);

                    var fileBytes =
                        _kpiExcelExportService.ExportPartProcesses(
                            data,
                            from,
                            to);

                    var fileName =
                        $"part-process-kpi_{from:yyyyMMdd}_{to:yyyyMMdd}.xlsx";

                    return File(
                        fileBytes,
                        ExcelContentType,
                        fileName);
                },
                errors => Problem(errors));
        }
    }
}
