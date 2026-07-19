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
        private readonly IInfluxSettings _settings;

        public MachineLogRepository(
            InfluxDBClient client,
            IOptions<InfluxSettings> options)
        {
            _client = client;
            _settings = options.Value;
        }

        private QueryApi QueryApi => _client.GetQueryApi();

        private WriteApiAsync WriteApi => _client.GetWriteApiAsync();

        public async Task InsertAsync(MachineLog log)
        {
            if (log.Time == default)
                log.Time = DateTime.UtcNow;

            await WriteApi.WriteMeasurementAsync(
                log,
                WritePrecision.Ms,
                _settings.Bucket,
                _settings.Org);
        }

        public async Task InsertAsync(IEnumerable<MachineLog> logs)
        {
            var list = logs.ToList();

            foreach (var item in list)
            {
                if (item.Time == default)
                    item.Time = DateTime.UtcNow;
            }

            await WriteApi.WriteMeasurementsAsync(
                list,
                WritePrecision.Ms,
                _settings.Bucket,
                _settings.Org);
        }

        public async Task<List<MachineLog>> GetHistoryAsync(
            long machineId,
            DateTime from,
            DateTime to)
        {
            var flux = $@"
            from(bucket: ""{_settings.Bucket}"")
            |> range(start: {from:O}, stop: {to:O})
            |> filter(fn: (r) => r._measurement == ""machine_log"")
            |> filter(fn: (r) => r.machineId == ""{machineId}"")
            |> filter(fn: (r) => r._field == ""status"")
            |> sort(columns: [""_time""])
            ";

            return await QueryApi.QueryAsync<MachineLog>(
                flux,
                _settings.Org);
        }

        public async Task<MachineLog?> GetLatestAsync(long machineId)
        {
            var flux = $@"
                from(bucket: ""{_settings.Bucket}"")
                |> range(start: -100y)
                |> filter(fn: (r) => r._measurement == ""machine_log"")
                |> filter(fn: (r) => r.machineId == ""{machineId}"")
                |> last()
                |> pivot(
                    rowKey:[""_time""],
                    columnKey:[""_field""],
                    valueColumn:""_value"")
                ";

            return (await QueryApi.QueryAsync<MachineLog>(
                flux,
                _settings.Org))
                .FirstOrDefault();
        }

        public async Task<List<MachineLog>> GetLatestAsync()
        {
            var flux = $@"
                from(bucket: ""{_settings.Bucket}"")
                |> range(start: -100y)
                |> filter(fn: (r) => r._measurement == ""machine_log"")
                |> filter(fn: (r) => r._field == ""status"")
                |> group(columns:[""machineId""])
                |> last()
                ";

            var tables = await QueryApi.QueryAsync(flux, _settings.Org);

            var result = new List<MachineLog>();

            foreach (var table in tables)
            {
                foreach (var record in table.Records)
                {
                    result.Add(new MachineLog
                    {
                        MachineId = long.Parse(record.GetValueByKey("machineId")!.ToString()!),
                        PartId = long.Parse(record.GetValueByKey("partId")!.ToString()!),
                        Status = Convert.ToInt32(record.GetValue()),
                        Time = record.GetTimeInDateTime().GetValueOrDefault()
                    });
                }
            }

            return result;
        }
    }
}
