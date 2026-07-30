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
            IReadOnlyCollection<PartProcessKPIResponse> items,
            DateOnly from,
            DateOnly to);
    }
}
