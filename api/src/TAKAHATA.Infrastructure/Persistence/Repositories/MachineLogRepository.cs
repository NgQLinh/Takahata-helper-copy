using Microsoft.Extensions.Logging;
using TAKAHATA.Application.Common.Interface.Repositories;
using TAKAHATA.Domain.DataLog;

namespace TAKAHATA.Infrastructure.Persistence.Repositories
{
    public class MachineLogRepository : IMachineLogRepository
    {
        private readonly ILogger<MachineLogRepository> _logger;
        private readonly AppDbContext _dbContext;

        public MachineLogRepository(
            AppDbContext dbContext,
            ILogger<MachineLogRepository> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task AddRangeAsync(List<MachineLog> machineLogs, CancellationToken stoppingToken)
        {
            try
            {
                await _dbContext.AddRangeAsync(machineLogs, stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error adding machine logs: {Message}", ex.Message);
            }
        }
    }
}
