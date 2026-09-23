using ErrorOr;
using TAKAHATA.Contracts.Settings;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Domain.PLC;

namespace TAKAHATA.Application.Common.Interface.Services
{
    public interface IPLCService
    {
        public bool TestConnection();
        Task<PLCResult<WriteResult>> WriteMachineData(Machine machine, int partId, int processId);
        Task<PLCResult<ReadResult>> ReadMachineData(Machine machine);
        Task<PLCResult<List<ReadResult>>> ReadMachinesData(List<Machine> machines);
        Task<PLCResult<WriteResult>> WriteMachineData(
            int statusBitAddress,
            int partBitAddress,
            int partProcessBitAddress,
            int statusValue,
            int partValue,
            int partProcessValue);

        Task<PLCResult<ReadMachineBitsResponse>> ReadMachineData(
            int statusBitAddress,
            int partBitAddress,
            int partProcessBitAddress);

        Task<PLCResult<bool>> IsProcessing(Machine machine);
    }
}
