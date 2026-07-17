using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using Microsoft.Extensions.Options;
using TAKAHATA.Application.Common.Interface.Influx.Repositories;
using TAKAHATA.Application.Common.Interface.Influx.Settings;
using TAKAHATA.Domain.DataLog;
using TAKAHATA.Infrastructure.Influx.Settings;

namespace TAKAHATA.Infrastructure.Influx.Repositories
{
    public class MachineLogRepository : IMachineLogRepository
    {
        private readonly InfluxDBClient _client;
        private readonly IInfluxSettings _influxSettings;

        public MachineLogRepository(
            InfluxDBClient client,
             IOptions<InfluxSettings> influxOption)
        {
            _client = client;
            _influxSettings = influxOption.Value;
        }

        private QueryApi QueryApi => _client.GetQueryApi();

        private WriteApiAsync WriteApi => _client.GetWriteApiAsync();

        public async Task<List<MachineLog>> GetHistoryAsync(
            long machineId,
            DateTime from,
            DateTime to)
        {
            var flux = $@"
                from(bucket: ""{_influxSettings.Bucket}"")
                |> range(start: {from:O}, stop: {to:O})
                |> filter(fn:(r)=>r._measurement==""machine_log"")
                |> filter(fn:(r)=>r.machineId==""{machineId}"")
                ";

            return await QueryApi.QueryAsync<MachineLog>(
                flux,
                _influxSettings.Org);
        }

        public async Task<MachineLog?> GetLatestAsync(long machineId)
        {
            var flux = $@"
                from(bucket: ""{_influxSettings.Bucket}"")
                |> range(start:-30d)
                |> filter(fn:(r)=>r._measurement==""machine_log"")
                |> filter(fn:(r)=>r.machineId==""{machineId}"")
                |> last()
                ";

            return (await QueryApi.QueryAsync<MachineLog>(
                flux,
                _influxSettings.Org))
                .FirstOrDefault();
        }

        public async Task<List<MachineLog>> GetLatestAsync()
        {
            var flux = $@"
                from(bucket: ""{_influxSettings.Bucket}"")
                |> range(start: -30d)
                |> filter(fn:(r)=>r._measurement==""machine_log"")
                |> group(columns:[""machineId""])
                |> last()
                ";

            return await QueryApi.QueryAsync<MachineLog>(
                flux,
                _influxSettings.Org);
        }

        public async Task InsertAsync(MachineLog log)
        {
            log.Time = DateTime.UtcNow;

            await WriteApi.WriteMeasurementAsync(log,
                WritePrecision.S,
                _influxSettings.Bucket,
                _influxSettings.Org);
        }

        public async Task InsertAsync(IEnumerable<MachineLog> logs)
        {
            var list = logs.ToList();

            foreach (var item in list)
                item.Time = DateTime.UtcNow;

            await WriteApi.WriteMeasurementsAsync(
                list,
                WritePrecision.S,
                _influxSettings.Bucket,
                _influxSettings.Org);
        }
    }
}
