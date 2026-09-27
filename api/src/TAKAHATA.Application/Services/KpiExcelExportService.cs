using ClosedXML.Excel;
using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Contracts.Report;

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
            IReadOnlyCollection<PartProcessKPIResponse> items,
            DateOnly from,
            DateOnly to)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Part Process KPI");
            const int lastColumn = 18;

            CreateTitle(
                worksheet,
                "BÁO CÁO THỜI GIAN GIA CÔNG PART",
                from,
                to,
                lastColumn);

            var headers = new[]
            {
                "STT",
                "Ngày kế hoạch",
                "Mã máy",
                "Tên máy",
                "Index",
                "Part",
                "Ước tính (giờ)",
                "Bắt đầu",
                "Kết thúc",
                "Máy chạy (Giờ)",
                "Gá đặt (Giờ)",
                "Chờ (Giờ)",
                "Lập trình (Giờ)",
                "Tổng (Giờ)",
                "Số lượng",
                "Đã hoàn thành",
                "Trạng thái",
                "Hiệu suất (%)"
            };

            WriteHeaders(worksheet, headers);

            var row = HeaderRow + 1;
            var index = 1;

            foreach (var item in items)
            {
                var totalMinutes = item.StartTime.HasValue && item.EndTime.HasValue
                    ? Math.Max((item.EndTime.Value - item.StartTime.Value).TotalMinutes, 0)
                    : 0;

                var efficiency = totalMinutes > 0
                    ? (item.WorkingTime ?? 0) / totalMinutes * 100
                    : 0;

                worksheet.Cell(row, 1).Value = index++;

                if (item.PlantDate.HasValue)
                {
                    worksheet.Cell(row, 2).Value =
                        item.PlantDate.Value.ToDateTime(TimeOnly.MinValue);
                }

                worksheet.Cell(row, 3).Value = item.MachineCode ?? string.Empty;
                worksheet.Cell(row, 4).Value = item.MachineName ?? item.MachineCode ?? string.Empty;
                worksheet.Cell(row, 5).Value = item.IndexCode ?? string.Empty;
                worksheet.Cell(row, 6).Value = item.PartCode;
                worksheet.Cell(row, 7).Value = item.EstimatedTime ?? 0;

                if (item.StartTime.HasValue)
                {
                    worksheet.Cell(row, 8).Value = item.StartTime.Value;
                }

                if (item.EndTime.HasValue)
                {
                    worksheet.Cell(row, 9).Value = item.EndTime.Value;
                }

                worksheet.Cell(row, 10).Value = item.WorkingTime ?? 0;
                worksheet.Cell(row, 11).Value = item.SetupTime ?? 0;
                worksheet.Cell(row, 12).Value = item.WaitingTime ?? 0;
                worksheet.Cell(row, 13).Value = item.ProgrammingTime ?? 0;
                worksheet.Cell(row, 14).Value = item.TotalTime ?? 0;
                worksheet.Cell(row, 15).Value = item.Quantity;
                worksheet.Cell(row, 16).Value = item.ProcessedQuantity;
                worksheet.Cell(row, 17).Value = item.Status.ToString();
                worksheet.Cell(row, 18).Value = efficiency;
                row++;
            }

            if (row > HeaderRow + 1)
            {
                worksheet.Range(HeaderRow + 1, 2, row - 1, 2)
                    .Style.DateFormat.Format = "dd/MM/yyyy";

                worksheet.Range(HeaderRow + 1, 8, row - 1, 9)
                    .Style.DateFormat.Format = "dd/MM/yyyy HH:mm";


                worksheet.Range(HeaderRow + 1, 10, row - 1, 14)
                    .Style.NumberFormat.Format = "0.00";

                worksheet.Range(HeaderRow + 1, 18, row - 1, 19)
                    .Style.NumberFormat.Format = "0.00";
            }

            FinishWorksheet(worksheet, row - 1, lastColumn);
            return Save(workbook);
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
