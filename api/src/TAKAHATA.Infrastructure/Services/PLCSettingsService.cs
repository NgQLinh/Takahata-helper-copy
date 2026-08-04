using TAKAHATA.Application.Common.Interface.Services;
using TAKAHATA.Domain.MasterData;
using TAKAHATA.Infrastructure.Persistence;

namespace TAKAHATA.Infrastructure.Services
{
    public class PLCSettingsService : IPLCSettingsService
    {
        private const string DefaultIpAddress = "192.168.1.1";
        private const int DefaultPort = 502;

        private readonly AppDbContext _appDbContext;

        public PLCSettingsService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Create(string ipAddress, int port)
        {
            Validate(ipAddress, port);

            using var transaction = _appDbContext.Database.BeginTransaction();

            try
            {
                var config = _appDbContext.SystemConfigs
                    .SingleOrDefault(x => x.Id == SystemConfig.SingletonId);

                if (config is null)
                {
                    config = new SystemConfig
                    {
                        Id = SystemConfig.SingletonId,
                        IpAddress = ipAddress.Trim(),
                        Port = port,
                        CreateAt = DateTime.Now
                    };

                    _appDbContext.SystemConfigs.Add(config);
                }
                else
                {
                    // Nếu đã có thì Create hoạt động như Upsert,
                    // không tạo thêm bản ghi mới.
                    config.IpAddress = ipAddress.Trim();
                    config.Port = port;
                    config.UpdateAt = DateTime.Now;
                }

                RemoveDuplicateRecords();

                _appDbContext.SaveChanges();
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public void Update(string ipAddress, int port)
        {
            Validate(ipAddress, port);

            using var transaction = _appDbContext.Database.BeginTransaction();

            try
            {
                var config = _appDbContext.SystemConfigs
                    .SingleOrDefault(x => x.Id == SystemConfig.SingletonId);

                if (config is null)
                {
                    // Tự động tạo cấu hình nếu chưa tồn tại.
                    config = new SystemConfig
                    {
                        Id = SystemConfig.SingletonId,
                        IpAddress = ipAddress.Trim(),
                        Port = port,
                        CreateAt = DateTime.Now
                    };

                    _appDbContext.SystemConfigs.Add(config);
                }
                else
                {
                    config.IpAddress = ipAddress.Trim();
                    config.Port = port;
                    config.UpdateAt = DateTime.Now;
                }

                RemoveDuplicateRecords();

                _appDbContext.SaveChanges();
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public string GetIpAddress()
        {
            var config = GetOrCreateDefaultConfig();

            return config.IpAddress;
        }

        public int GetPort()
        {
            var config = GetOrCreateDefaultConfig();

            return config.Port;
        }

        private SystemConfig GetOrCreateDefaultConfig()
        {
            var config = _appDbContext.SystemConfigs
                .SingleOrDefault(x => x.Id == SystemConfig.SingletonId);

            if (config is not null)
            {
                return config;
            }

            using var transaction = _appDbContext.Database.BeginTransaction();

            try
            {
                // Kiểm tra lại sau khi bắt đầu transaction để hạn chế
                // trường hợp nhiều request cùng tạo cấu hình.
                config = _appDbContext.SystemConfigs
                    .SingleOrDefault(x => x.Id == SystemConfig.SingletonId);

                if (config is null)
                {
                    config = new SystemConfig
                    {
                        Id = SystemConfig.SingletonId,
                        IpAddress = DefaultIpAddress,
                        Port = DefaultPort,
                        CreateAt = DateTime.Now
                    };

                    _appDbContext.SystemConfigs.Add(config);
                }

                RemoveDuplicateRecords();

                _appDbContext.SaveChanges();
                transaction.Commit();

                return config;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        private void RemoveDuplicateRecords()
        {
            var duplicateConfigs = _appDbContext.SystemConfigs
                .Where(x => x.Id != SystemConfig.SingletonId)
                .ToList();

            if (duplicateConfigs.Count > 0)
            {
                _appDbContext.SystemConfigs.RemoveRange(duplicateConfigs);
            }
        }

        private static void Validate(string ipAddress, int port)
        {
            if (string.IsNullOrWhiteSpace(ipAddress))
            {
                throw new ArgumentException(
                    "Địa chỉ IP không được để trống.",
                    nameof(ipAddress));
            }

            if (port is < 1 or > 65535)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(port),
                    "Port phải nằm trong khoảng từ 1 đến 65535.");
            }

            if (!System.Net.IPAddress.TryParse(ipAddress.Trim(), out _))
            {
                throw new ArgumentException(
                    "Địa chỉ IP không đúng định dạng.",
                    nameof(ipAddress));
            }
        }
    }
}