using System.Diagnostics;

namespace TAKAHATA.Api.Middleware
{
    public class CorrelationIdMiddleware
    {
        private const string HeaderName = "X-Correlation-ID";

        private readonly RequestDelegate _next;
        private readonly ILogger<CorrelationIdMiddleware> _logger;

        public CorrelationIdMiddleware(
            RequestDelegate next,
            ILogger<CorrelationIdMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string correlationId;

            if (context.Request.Headers.TryGetValue(
                HeaderName,
                out var headerValue))
            {
                correlationId = headerValue!;
            }
            else
            {
                correlationId = Guid.NewGuid().ToString();
            }

            context.Items["CorrelationId"] = correlationId;

            context.Response.Headers[HeaderName] = correlationId;

            using (_logger.BeginScope(new Dictionary<string, object>
            {
                ["CorrelationId"] = correlationId
            }))
            {
                await _next(context);
            }
        }
    }
}
