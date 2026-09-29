using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Text;
using TAKAHATA.Application.Common.Interface.Repositories;

namespace TAKAHATA.Application.Services
{
    public sealed class PlcTcpListenerService : BackgroundService
    {
        private const int MaxMessageLength = 1024;
        private static readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(5);
        private readonly int _port;
        private readonly ILogger<PlcTcpListenerService> _logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private long _connectionId;

        public PlcTcpListenerService(
            ILogger<PlcTcpListenerService> logger,
            IServiceScopeFactory serviceScopeFactory,
            IConfiguration configuration)
        {
            _logger = logger;
            _serviceScopeFactory = serviceScopeFactory;
            _port = configuration.GetValue<int>("PortSettings:Port", 4090);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var logScope = _logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["MachineLog"] = true
                });

            await Task.Yield();

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await RunListenerAsync(stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "PLC TCP listener lỗi. Thử lại sau {Seconds} giây",
                        RetryDelay.TotalSeconds);
                }

                if (stoppingToken.IsCancellationRequested)
                    break;

                try
                {
                    await Task.Delay(RetryDelay, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
            }

            _logger.LogInformation("PLC TCP Service đã dừng");
        }

        private async Task RunListenerAsync(CancellationToken stoppingToken)
        {
            using var sessionCts =
                CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);

            var connections = new ConcurrentDictionary<long, Task>();
            var listener = new TcpListener(IPAddress.Any, _port);

            try
            {
                listener.Start();

                _logger.LogInformation(
                    "PLC TCP Server đang lắng nghe tại 0.0.0.0:{Port}",
                    _port);

                while (!sessionCts.IsCancellationRequested)
                {
                    TcpClient client =
                        await listener.AcceptTcpClientAsync(sessionCts.Token);

                    long id = Interlocked.Increment(ref _connectionId);
                    Task task = ReceiveAsync(client, sessionCts.Token);

                    connections[id] = task;
                    _ = ObserveConnectionAsync(id, task, connections);
                }
            }
            finally
            {
                listener.Stop();
                sessionCts.Cancel();

                try
                {
                    await Task.WhenAll(connections.Values);
                }
                catch (OperationCanceledException)
                    when (sessionCts.IsCancellationRequested)
                {
                    // Service đang dừng.
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(
                        ex,
                        "Lỗi khi dọn các kết nối PLC");
                }

                _logger.LogInformation(
                    "Đã đóng lượt lắng nghe TCP port {Port}",
                    _port);
            }
        }

        private async Task ObserveConnectionAsync(
            long id,
            Task task,
            ConcurrentDictionary<long, Task> connections)
        {
            try
            {
                await task;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Tác vụ kết nối PLC {ConnectionId} gặp lỗi",
                    id);
            }
            finally
            {
                connections.TryRemove(id, out _);
            }
        }

        private async Task ReceiveAsync(
            TcpClient client,
            CancellationToken cancellationToken)
        {
            string remote = "Unknown";

            using (client)
            {
                try
                {
                    remote = client.Client.RemoteEndPoint?.ToString()
                        ?? "Unknown";

                    _logger.LogInformation(
                        "PLC đã kết nối: {Remote}",
                        remote);

                    using NetworkStream stream = client.GetStream();

                    byte[] buffer = new byte[4096];
                    var message = new StringBuilder();

                    while (!cancellationToken.IsCancellationRequested)
                    {
                        int count = await stream.ReadAsync(
                            buffer.AsMemory(),
                            cancellationToken);

                        if (count == 0)
                        {
                            _logger.LogInformation(
                                "PLC chủ động đóng kết nối: {Remote}",
                                remote);

                            if (message.Length > 0)
                            {
                                _logger.LogWarning(
                                    "PLC {Remote} đóng kết nối khi còn bản tin " +
                                    "chưa kết thúc bằng \\n: {Message}",
                                    remote,
                                    message.ToString());
                            }

                            break;
                        }

                        for (int i = 0; i < count; i++)
                        {
                            byte value = buffer[i];

                            if (value == (byte)'\n')
                            {
                                // TrimEnd hỗ trợ cả \n và \r\n.
                                string completeMessage =
                                    message.ToString().TrimEnd('\r');

                                message.Clear();

                                if (completeMessage.Length > 0)
                                {
                                    await ProcessMessageAsync(
                                        completeMessage,
                                        remote,
                                        cancellationToken);
                                }

                                continue;
                            }

                            if (message.Length >= MaxMessageLength)
                            {
                                _logger.LogWarning(
                                    "Bản tin từ PLC {Remote} vượt quá " +
                                    "{MaxLength} ký tự. Đóng kết nối.",
                                    remote,
                                    MaxMessageLength);

                                return;
                            }

                            // Giao thức hiện tại dùng ký tự ASCII.
                            message.Append((char)value);
                        }
                    }
                }
                catch (OperationCanceledException)
                    when (cancellationToken.IsCancellationRequested)
                {
                    // Ứng dụng đang dừng.
                }
                catch (Exception ex)
                    when (cancellationToken.IsCancellationRequested)
                {
                    _logger.LogDebug(
                        ex,
                        "Đang đóng kết nối PLC: {Remote}",
                        remote);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(
                        ex,
                        "Lỗi nhận dữ liệu PLC {Remote}. Đóng kết nối này; " +
                        "server tiếp tục lắng nghe.",
                        remote);
                }
                finally
                {
                    _logger.LogInformation(
                        "Kết thúc kết nối PLC: {Remote}",
                        remote);
                }
            }
        }

        private async Task ProcessMessageAsync(
            string message,
            string remote,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation(
                "Nhận bản tin PLC từ {Remote}: {Message}",
                remote,
                message);

            string[] parts = message.Split('|');

            if (parts.Length != 5
                || !int.TryParse(parts[0].Trim(), out int statusBitAddress)
                || !int.TryParse(parts[1].Trim(), out int status)
                || !int.TryParse(parts[2].Trim(), out int partId)
                || !int.TryParse(parts[3].Trim(), out int processId)
                || !double.TryParse(
                    parts[4].Trim(),
                    NumberStyles.Float,
                    CultureInfo.InvariantCulture,
                    out double workingTime)
                || !double.IsFinite(workingTime)
                || workingTime < 0)
            {
                _logger.LogWarning(
                    "Bản tin PLC không hợp lệ từ {Remote}: {Message}. " +
                    "Bỏ qua bản tin.",
                    remote,
                    message);

                return;
            }

            try
            {
                await using var scope =
                    _serviceScopeFactory.CreateAsyncScope();

                var repository = scope.ServiceProvider
                    .GetRequiredService<IUnitOfWorkRepository>();

                await repository.UpdateDataAsync(
                    statusBitAddress,
                    status,
                    partId,
                    processId,
                    workingTime);
            }
            catch (OperationCanceledException)
                when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Cập nhật dữ liệu PLC thất bại. Remote: {Remote}, " +
                    "bản tin: {Message}",
                    remote,
                    message);

                // Giữ kết nối để PLC có thể gửi bản tin tiếp theo.
            }
        }
    }
}