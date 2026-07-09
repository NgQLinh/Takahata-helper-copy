using TAKAHATA.Domain.MasterData;

namespace TAKAHATA.Application.Common.Interface.MaintenanceProcess
{
    public interface IMachineMaintenanceProcessRepository
    {
        Task<MachineMaintenanceProcess?> AddAsync(MachineMaintenanceProcess machineMaintenanceProcess);
    }
}
