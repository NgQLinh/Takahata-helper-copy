using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Contracts.Report;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TAKAHATA.Application.Services
{
    public sealed class KpiExcelExportService : IKpiExcelExportService
    {
        private const int HeaderRow = 4;

        public byte[] ExportMachines(
            IReadOnlyCollection<MachineKPIResponse> items,
            DateOnly from,
            DateOnly to)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Machine KPI");
            const int lastColumn = 8;

            CreateTitle(
                worksheet,
                "BÁO CÁO KPI HIỆU SUẤT MÁY",
                from,
                to,
                lastColumn);

            var headers = new[]
            {
            "STT",
            "Mã máy",
            "Tên máy",
            "Loại máy",
            "Hoạt động (giờ)",
            "Bảo trì (giờ)",
            "Trạng thái",
            "Hiệu suất (%)"
        };

            WriteHeaders(worksheet, headers);

            var totalDays = to.DayNumber - from.DayNumber + 1;
            var availableHoursPerMachine = Math.Max(totalDays, 0) * 8d;
            var row = HeaderRow + 1;
            var index = 1;

            foreach (var item in items)
            {
                var efficiency = availableHoursPerMachine > 0
                    ? (item.WorkingTime ?? 0) / availableHoursPerMachine * 100
                    : 0;

                worksheet.Cell(row, 1).Value = index++;
                worksheet.Cell(row, 2).Value = item.Code ?? string.Empty;
                worksheet.Cell(row, 3).Value = item.Name ?? item.Code ?? string.Empty;
                worksheet.Cell(row, 4).Value = item.Type ?? string.Empty;
                worksheet.Cell(row, 5).Value = item.WorkingTime ?? 0;
                worksheet.Cell(row, 6).Value = item.MaintenanceTime ?? 0;
                worksheet.Cell(row, 7).Value = item.MachineStatus.ToString();
                worksheet.Cell(row, 8).Value = efficiency;
                row++;
            }

            if (row > HeaderRow + 1)
            {
                worksheet.Range(HeaderRow + 1, 5, row - 1, 6)
                    .Style.NumberFormat.Format = "0.00";
                worksheet.Range(HeaderRow + 1, 8, row - 1, 8)
                    .Style.NumberFormat.Format = "0.00";
            }

            FinishWorksheet(worksheet, row - 1, lastColumn);
            return Save(workbook);
        }

        public byte[] ExportPartProcesses(
            IWebHostEnvironment environment,
            IReadOnlyCollection<PartProcessKPIResponse> items,
            DateOnly from,
            DateOnly to)
        {
            ArgumentNullException.ThrowIfNull(environment);
            ArgumentNullException.ThrowIfNull(items);

            if (from > to)
            {
                throw new ArgumentException(
                    "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.",
                    nameof(from));
            }

            const int firstDataRow = 8;
            const int lastColumn = 19; // S

            if (items.Count > 1_048_576 - firstDataRow + 1)
            {
                throw new ArgumentException(
                    "Số lượng dữ liệu vượt quá giới hạn dòng của Excel.",
                    nameof(items));
            }

            var templatePath = Path.Combine(
                environment.ContentRootPath,
                "templates",
                "detail_template.xlsx");

            // Copy template vào RAM, đóng file trước khi xử lý workbook.
            // Các request có thể cùng đọc template.
            using var templateStream = new MemoryStream();

            using (var fileStream = new FileStream(
                templatePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read))
            {
                fileStream.CopyTo(templateStream);
            }

            templateStream.Position = 0;

            // Mỗi lần gọi tạo workbook riêng, không chia sẻ giữa các request.
            using var workbook = new XLWorkbook(templateStream);

            var worksheet = workbook.Worksheets.FirstOrDefault(
                x => string.Equals(
                    x.Name.Trim(),
                    "DETAIL",
                    StringComparison.OrdinalIgnoreCase))
                ?? throw new InvalidOperationException(
                    "Template không có worksheet DETAIL.");

            // Kỳ báo cáo.
            worksheet.Range("A4:F4").Unmerge();
            worksheet.Range("A4:F4").Clear(XLClearOptions.Contents);
            worksheet.Range("A4:F4").Merge();

            worksheet.Cell("A4").Value =
                $"PERIOD: {from:dd/MM/yyyy} - {to:dd/MM/yyyy}";

            worksheet.Range("A4:F4").Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Left;

            // Máy hiển thị trên tiêu đề.
            var machines = items
                .GroupBy(x => x.MachineId)
                .Select(g =>
                {
                    var machine = g.First();

                    return !string.IsNullOrWhiteSpace(machine.MachineCode)
                        ? machine.MachineCode!
                        : machine.MachineName ?? machine.MachineId.ToString();
                })
                .ToList();

            worksheet.Range("H4:J4").Unmerge();
            worksheet.Range("H4:J4").Clear(XLClearOptions.Contents);
            worksheet.Range("H4:J4").Merge();

            //worksheet.Cell("H4").Value = machines.Count switch
            //{
            //    0 => string.Empty,
            //    1 => machines[0],
            //    _ => "ALL MACHINES"
            //};

            // Điều chỉnh tên cột để khớp ý nghĩa dữ liệu DTO.
            worksheet.Cell("M6").Value = "WORKING TIME\n(h)";
            worksheet.Cell("R7").Value = "Processed Qty";

            // Xóa dữ liệu cũ nếu template được bổ sung dữ liệu sau này.
            var oldLastRow = worksheet.LastRowUsed()?.RowNumber() ?? 7;

            if (oldLastRow >= firstDataRow)
            {
                worksheet.Range(
                    firstDataRow, 1,
                    oldLastRow, lastColumn)
                    .Clear(XLClearOptions.Contents);
            }

            var lastDataRow = firstDataRow + items.Count - 1;
            var lastReportRow = Math.Max(firstDataRow, lastDataRow);

            // Template hiện tại chưa có dòng mẫu dữ liệu.
            var dataRange = worksheet.Range(
                firstDataRow, 1,
                lastReportRow, lastColumn);

            dataRange.Style.Font.FontName = "Arial";
            dataRange.Style.Font.FontSize = 10;
            dataRange.Style.Font.Bold = false;

            dataRange.Style.Alignment.Vertical =
                XLAlignmentVerticalValues.Center;

            dataRange.Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Center;

            dataRange.Style.Alignment.WrapText = true;

            dataRange.Style.Border.OutsideBorder =
                XLBorderStyleValues.Thin;

            dataRange.Style.Border.InsideBorder =
                XLBorderStyleValues.Thin;

            worksheet.Range(firstDataRow, 4, lastReportRow, 7)
                .Style.Alignment.Horizontal =
                    XLAlignmentHorizontalValues.Left;

            worksheet.Range(firstDataRow, 19, lastReportRow, 19)
                .Style.Alignment.Horizontal =
                    XLAlignmentHorizontalValues.Left;

            worksheet.Range(firstDataRow, 1, lastReportRow, 1)
                .Style.NumberFormat.Format = "dd/MM/yyyy";

            worksheet.Range(firstDataRow, 8, lastReportRow, 9)
                .Style.NumberFormat.Format = "hh:mm";

            worksheet.Range(firstDataRow, 10, lastReportRow, 13)
                .Style.NumberFormat.Format = "#,##0.00";

            worksheet.Range(firstDataRow, 18, lastReportRow, 18)
                .Style.NumberFormat.Format = "#,##0";

            var row = firstDataRow;

            int i = 0;

            foreach (var item in items)
            {
                worksheet.Row(row).Height = 32;

                // A: Ngày thực hiện; ưu tiên ngày bắt đầu.
                var reportDate = item.StartTime?.Date ?? item.PlantDate?.ToDateTime(TimeOnly.MinValue);

                if (reportDate.HasValue)
                {
                    if (i != 0 && i < items.Count)
                    {
                        var beforeItem = items.ToList()[i - 1];
                        var beforeReportDate = beforeItem.StartTime?.Date ?? beforeItem.PlantDate?.ToDateTime(TimeOnly.MinValue);

                        if (beforeItem.MachineId != item.MachineId || (beforeReportDate.HasValue && reportDate.Value != beforeReportDate.Value))
                            worksheet.Cell(row, 1).Value = reportDate.Value;
                    }
                    else
                    {
                        worksheet.Cell(row, 1).Value = reportDate.Value;
                    }
                }

                // B: ACC FIX ASSETS — DTO chưa có, để trống.
                worksheet.Cell(row, 3).Value = item.MachineCode ?? "";
                worksheet.Cell(row, 4).Value = item.MachineName ?? "";

                // E: CLASSIFICATION — DTO chưa có, để trống.
                worksheet.Cell(row, 6).Value = item.IndexCode ?? "";
                worksheet.Cell(row, 7).Value = item.PartCode;

                // H, I: Lưu kiểu ngày giờ, hiển thị hh:mm.
                if (item.StartTime.HasValue)
                {
                    worksheet.Cell(row, 8).Value = item.StartTime.Value;
                }

                if (item.EndTime.HasValue)
                {
                    worksheet.Cell(row, 9).Value = item.EndTime.Value;
                }

                // J: Tổng thời gian (giờ).
                if (item.TotalTime.HasValue)
                {
                    worksheet.Cell(row, 10).Value = item.TotalTime.Value;
                }
                else if (
                    item.WorkingTime.HasValue ||
                    item.SetupTime.HasValue ||
                    item.WaitingTime.HasValue ||
                    item.ProgrammingTime.HasValue)
                {
                    worksheet.Cell(row, 10).Value =
                        (item.WorkingTime ?? 0)
                        + (item.SetupTime ?? 0)
                        + (item.WaitingTime ?? 0)
                        + (item.ProgrammingTime ?? 0);
                }

                // K: Setup; L: Programming; M: Working.
                SetNumber(worksheet.Cell(row, 11), item.SetupTime);
                SetNumber(worksheet.Cell(row, 12), item.WaitingTime);
                SetNumber(worksheet.Cell(row, 13), item.WorkingTime);

                // TOTAL UTILIZATION RATE OF DAY(%)
                worksheet.Cell(row, 16).FormulaA1 = $"100-O{row}";

                // Hiệu suất
                worksheet.Cell(row, 15).FormulaA1 = $"SUM(J{row})*100/24";


                // N: P.I.C — DTO chưa có người thực hiện.
                // O, P: Chưa có số giờ khả dụng để tính tỷ lệ, để trống.

                worksheet.Cell(row, 5).Value = item.PartType.ToString();
                worksheet.Cell(row, 18).Value = item.ProcessedQuantity;

                // S: Thông tin bổ sung.
                //var notes = new List<string>
                //{
                //    $"Status: {item.Status}",
                //    $"Quantity: {item.Quantity}"
                //};

                //if (item.WaitingTime.HasValue)
                //{
                //    notes.Add(FormattableString.Invariant(
                //        $"Waiting: {item.WaitingTime.Value:0.00} h"));
                //

                //if (item.EstimatedTime.HasValue)
                //{
                //    notes.Add(FormattableString.Invariant(
                //        $"Estimated: {item.EstimatedTime.Value:0.00} h"));
                //}

                //worksheet.Cell(row, 19).Value = string.Join("\n", notes);

                row++;
                i++;
            }

            worksheet.SheetView.FreezeRows(7);

            if (items.Count > 0)
            {
                worksheet.Range(7, 1, lastDataRow, lastColumn)
                    .SetAutoFilter();
            }

            // Giữ chiều rộng cột của template.
            worksheet.PageSetup.PageOrientation =
                XLPageOrientation.Landscape;

            worksheet.PageSetup.FitToPages(1, 0);
            worksheet.PageSetup.SetRowsToRepeatAtTop(1, 7);

            worksheet.PageSetup.PrintAreas.Clear();
            worksheet.PageSetup.PrintAreas.Add(
                $"A1:S{lastReportRow}");

            using var outputStream = new MemoryStream();

            workbook.SaveAs(outputStream);

            return outputStream.ToArray();

            static void SetNumber(IXLCell cell, double? value)
            {
                if (value.HasValue)
                {
                    cell.Value = value.Value;
                }
            }
        }

        private static void CreateTitle(
            IXLWorksheet worksheet,
            string title,
            DateOnly from,
            DateOnly to,
            int lastColumn)
        {
            var titleRange = worksheet.Range(1, 1, 1, lastColumn);
            titleRange.Merge();
            titleRange.Value = title;
            titleRange.Style.Font.Bold = true;
            titleRange.Style.Font.FontSize = 16;
            titleRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            var filterRange = worksheet.Range(2, 1, 2, lastColumn);
            filterRange.Merge();
            filterRange.Value = $"Từ ngày {from:dd/MM/yyyy} đến ngày {to:dd/MM/yyyy}";
            filterRange.Style.Font.Italic = true;
            filterRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        private static void WriteHeaders(IXLWorksheet worksheet, string[] headers)
        {
            for (var column = 0; column < headers.Length; column++)
            {
                worksheet.Cell(HeaderRow, column + 1).Value = headers[column];
            }

            var headerRange = worksheet.Range(HeaderRow, 1, HeaderRow, headers.Length);
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.FontColor = XLColor.White;
            headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#1677FF");
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            headerRange.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            headerRange.Style.Alignment.WrapText = true;
        }

        private static void FinishWorksheet(
            IXLWorksheet worksheet,
            int lastDataRow,
            int lastColumn)
        {
            var effectiveLastRow = Math.Max(lastDataRow, HeaderRow);
            var usedRange = worksheet.Range(HeaderRow, 1, effectiveLastRow, lastColumn);

            usedRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            usedRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
            usedRange.SetAutoFilter();

            worksheet.SheetView.FreezeRows(HeaderRow);
            worksheet.Columns(1, lastColumn).AdjustToContents();

            for (var columnIndex = 1; columnIndex <= lastColumn; columnIndex++)
            {
                var column = worksheet.Column(columnIndex);
                if (column.Width > 35)
                {
                    column.Width = 35;
                }
            }
        }

        private static byte[] Save(XLWorkbook workbook)
        {
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
