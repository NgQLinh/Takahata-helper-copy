namespace TAKAHATA.Domain.PLC
{
    public class ReadResult
    {
        public int Status { get; set; }
        public int PartId { get; set; }
        public int PartProcessId { get; set; }
    }
}
