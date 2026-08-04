using System.Net;
using Microsoft.EntityFrameworkCore;
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
            Save(ipAddress, port);
        }

        public void Update(string ipAddress, int port)
        {
            Save(ipAddress, port);
        }

        public string GetIpAddress()
        {
            var config = GetConfig();

            return config.IpAddress;
        }

        public int GetPort()
        {
            var config = GetConfig();

            return config.Port;
        }

        private void Save(string ipAddress, int port)
        {
            Validate(ipAddress, port);

            var normalizedIpAddress = ipAddress.Trim();

            var config = _appDbContext.SystemConfigs
                .FirstOrDefault(x => x.Id == SystemConfig.SingletonId);

            if (config is null)
            {
                config = new SystemConfig
                {
                    Id = SystemConfig.SingletonId,
                    IpAddress = normalizedIpAddress,
                    Port = port,
                    CreateAt = DateTime.Now
                };

                _appDbContext.SystemConfigs.Add(config);
            }
            else
            {
                config.IpAddress = normalizedIpAddress;
                config.Port = port;
                config.UpdateAt = DateTime.Now;
            }

            _appDbContext.SaveChanges();
        }

        private SystemConfig GetConfig()
        {
            var config = _appDbContext.SystemConfigs
                .AsNoTracking()
                .FirstOrDefault(x => x.Id == SystemConfig.SingletonId);

            if (config is not null)
            {
                return config;
            }

            config = new SystemConfig
            {
                Id = SystemConfig.SingletonId,
                IpAddress = DefaultIpAddress,
                Port = DefaultPort,
                CreateAt = DateTime.Now
            };

            _appDbContext.SystemConfigs.Add(config);
            _appDbContext.SaveChanges();

            return config;
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

            if (!IPAddress.TryParse(ipAddress.Trim(), out _))
            {
                throw new ArgumentException(
                    "Địa chỉ IP không đúng định dạng.",
                    nameof(ipAddress));
            }
        }
    }
}