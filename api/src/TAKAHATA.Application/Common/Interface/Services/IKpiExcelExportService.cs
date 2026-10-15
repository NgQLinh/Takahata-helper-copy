using Microsoft.AspNetCore.Hosting;
using TAKAHATA.Contracts.Report;
using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.Services
{
    public interface IKpiExcelExportService
    {
        byte[] ExportMachines(
            IReadOnlyCollection<MachineKPIResponse> items,
            DateOnly from,
            DateOnly to);

        Task<byte[]> ExportPartProcesses(
           IWebHostEnvironment environment,
           IReadOnlyCollection<PartProcessKPIResponse> items,
           DateOnly from,
           DateOnly to,
           List<Machine> machines);
    }
}
