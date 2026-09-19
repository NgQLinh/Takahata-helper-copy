using Microsoft.Extensions.Logging;
using TAKAHATA.Application.Common.Interface.Repositories;

namespace TAKAHATA.Application.Services
{
    public class DailyJob
    {
        private readonly ILogger<DailyJob> _logger;
        private readonly IPartProcessRepository _partProcessRepository;

        public DailyJob(
            ILogger<DailyJob> logger,
            IPartProcessRepository partProcessRepository)
        {
            _logger = logger;
            _partProcessRepository = partProcessRepository;
        }

        public async Task ExecuteAsync()
        {
            _logger.LogInformation("DailyJob bắt đầu lúc {Time}", DateTimeOffset.Now);
            await _partProcessRepository.HandleExtend();
            _logger.LogInformation("DailyJob hoàn thành");
        }
    }
}
