using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Domain.Common.Enum;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class UnitOfWorkRepository : IUnitOfWorkRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<UnitOfWorkRepository> _logger;

        public UnitOfWorkRepository(AppDbContext dbContext, ILogger<UnitOfWorkRepository> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task UpdateDataAsync(
            int statusBitAddress,
            int status,
            int partId,
            int processId,
            double workingTime)
        {
            using var logScope = _logger.BeginScope(new Dictionary<string, object> { ["MachineLog"] = true });

            var errors = new List<Exception>();

            // 1. Cập nhật máy độc lập
            if (statusBitAddress != 0)
            {
                try
                {
                    await using var transaction = await _dbContext.Database.BeginTransactionAsync();

                    var changeAt = DateTime.Now;

                    var affectedRows = await _dbContext.Machines
                        .Where(m => m.StatusBitAddress == statusBitAddress)
                        .ExecuteUpdateAsync(setters => setters
                            .SetProperty(
                                m => m.MachineStatus,
                                (MachineStatus)status)
                            .SetProperty(m => m.PartId, partId)
                            .SetProperty(m => m.PartProcessId, processId)
                            .SetProperty(m => m.MachineStatusChangeAt, changeAt));

                    await transaction.CommitAsync();

                    _logger.LogInformation(
                        "Cập nhật máy thành công. " +
                        "StatusBitAddress={StatusBitAddress}, Status={Status}, " +
                        "PartId={PartId}, ProcessId={ProcessId}, Rows={Rows}",
                        statusBitAddress, status, partId, processId, affectedRows);
                }
                catch (Exception ex)
                {
                    // Transaction chưa commit tự rollback khi dispose.
                    _logger.LogError(
                        ex,
                        "Cập nhật máy thất bại. StatusBitAddress={StatusBitAddress}",
                        statusBitAddress);

                    errors.Add(ex);
                }
            }

            // 2. Cập nhật thời gian độc lập, kể cả khi cập nhật máy thất bại
            if (processId != 0 && workingTime != 0)
            {
                try
                {
                    await using var transaction = await _dbContext.Database.BeginTransactionAsync();

                    var affectedRows = await _dbContext.PartProcesses
                        .Where(pp => pp.Id == processId)
                        .ExecuteUpdateAsync(setters => setters
                            .SetProperty(
                                pp => pp.WaitingTime,
                                pp => Math.Round((pp.WorkingTime ?? 0d) + workingTime, 2)));

                    await transaction.CommitAsync();

                    _logger.LogInformation(
                        "Cập nhật thời gian thành công. " +
                        "ProcessId={ProcessId}, WorkingTime={WorkingTime}, Rows={Rows}",
                        processId, workingTime, affectedRows);
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Cập nhật thời gian thất bại. " +
                        "ProcessId={ProcessId}, WorkingTime={WorkingTime}",
                        processId, workingTime);

                    errors.Add(ex);
                }
            }

            // Báo lỗi sau khi đã thực hiện cả hai phần.
            // Phần đã commit thành công không bị rollback.
            if (errors.Count > 0)
            {
                throw new AggregateException(
                    "Có lỗi khi cập nhật dữ liệu máy hoặc thời gian công đoạn.",
                    errors);
            }
        }
    }
}
