using TAKAHATA.Application.Common.Interface.Influx.Settings;

namespace TAKAHATA.Infrastructure.Influx.Settings
{
    public class InfluxSettings : IInfluxSettings
    {
        public static string SectionName { get; } = "InfluxDB";
        public string Org { get; set; } = string.Empty;
        public string Bucket { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }
}
