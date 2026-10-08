using Microsoft.AspNetCore.Hosting;
using TAKAHATA.Contracts.Report;

namespace TAKAHATA.Application.Common.Interface.Services
{
    public interface IKpiExcelExportService
    {
        byte[] ExportMachines(
            IReadOnlyCollection<MachineKPIResponse> items,
            DateOnly from,
            DateOnly to);

        byte[] ExportPartProcesses(
            IWebHostEnvironment environment,
            IReadOnlyCollection<PartProcessKPIResponse> items,
            DateOnly from,
            DateOnly to);
    }
}
