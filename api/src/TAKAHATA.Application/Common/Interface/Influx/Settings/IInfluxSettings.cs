namespace TAKAHATA.Application.Common.Interface.Influx.Settings
{
    public interface IInfluxSettings
    {
        public string Org { get; set; }
        public string Bucket { get; set; }
        public string Token { get; set; }
        public string Url { get; set; }
    }
}
