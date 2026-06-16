namespace TAKAHATA.Contracts.Common
{
    public class Response
    {
        public long Id { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public string CreateBy { get; set; } = string.Empty;
        public DateTime? UpdateAt { get; set; }
        public string? UpdateBy { get; set; }
    }
}
