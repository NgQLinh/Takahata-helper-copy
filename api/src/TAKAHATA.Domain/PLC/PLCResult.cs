namespace TAKAHATA.Domain.PLC
{
    public class PLCResult<T>
    {
        public bool IsSuccess { get; set; }
        public Exception? Error { get; set; }
        public T? Value { get; set; }

        private PLCResult()
        {

        }

        public static PLCResult<T> Success(T value)
        {
            return new PLCResult<T>
            {
                IsSuccess = true,
                Value = value
            };
        }

        public static PLCResult<T> Fail(Exception ex)
        {
            return new PLCResult<T>
            {
                IsSuccess = false,
                Error = ex
            };
        }
    }
}
