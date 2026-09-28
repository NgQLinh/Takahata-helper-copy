using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace TAKAHATA.Application.Services
{
    public sealed class PlcTcpListenerService : BackgroundService
    {
        private const int Port = 4090;
        private static readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(5);
        private readonly ILogger<PlcTcpListenerService> _logger;
        private long _connectionId;

        public PlcTcpListenerService(ILogger<PlcTcpListenerService> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var logScope = _logger.BeginScope(
                new Dictionary<string, object>
                {
                    ["MachineLog"] = true
                });

            // Đảm bảo phần khởi động listener chạy nền.
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
            // Mỗi lượt chạy có token và danh sách kết nối riêng.
            using var sessionCts = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
            var connections = new ConcurrentDictionary<long, Task>();
            var listener = new TcpListener(IPAddress.Any, Port);

            try
            {
                listener.Start();

                _logger.LogInformation("PLC TCP Server đang lắng nghe tại 0.0.0.0:{Port}", Port);

                while (!sessionCts.IsCancellationRequested)
                {
                    var client = await listener.AcceptTcpClientAsync(sessionCts.Token);

                    long id = Interlocked.Increment(ref _connectionId);

                    var task = ReceiveAsync(client, sessionCts.Token);

                    connections[id] = task;

                    // Theo dõi và dọn task khi kết nối kết thúc.
                    _ = ObserveConnectionAsync(id, task, connections);
                }
            }
            finally
            {
                // Ngừng nhận kết nối mới.
                listener.Stop();

                // Hủy ReadAsync của tất cả kết nối trong lượt chạy này.
                sessionCts.Cancel();

                try
                {
                    await Task.WhenAll(connections.Values);
                }
                catch (OperationCanceledException)
                    when (sessionCts.IsCancellationRequested)
                {
                    // Hủy khi dừng hoặc khởi động lại listener.
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Lỗi khi dọn các kết nối PLC");
                }

                _logger.LogInformation("Đã đóng lượt lắng nghe TCP port {Port}", Port);
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
                // Quan sát lỗi để không bỏ sót exception của task nền.
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
                    remote = client.Client.RemoteEndPoint?.ToString() ?? "Unknown";

                    _logger.LogInformation("PLC đã kết nối: {Remote}", remote);

                    using NetworkStream stream = client.GetStream();

                    byte[] buffer = new byte[4096];

                    while (!cancellationToken.IsCancellationRequested)
                    {
                        int count = await stream.ReadAsync(buffer.AsMemory(), cancellationToken);

                        if (count == 0)
                        {
                            _logger.LogInformation("PLC chủ động đóng kết nối: {Remote}", remote);
                            break;
                        }

                        string text = Encoding.ASCII.GetString(buffer, 0, count);
                        string hex = Convert.ToHexString(buffer.AsSpan(0, count));

                        _logger.LogInformation(
                            """
                            Nhận dữ liệu PLC: {Remote}
                            Số byte: {Count}
                            TEXT: {Text}
                            HEX: {Hex}
                            """,
                            remote,
                            count,
                            text,
                            hex);

                        // Xử lý dữ liệu tại đây.
                        // TCP có thể chia nhỏ hoặc gộp các bản tin.
                        // Cần ghép/tách bản tin trước khi xử lý nghiệp vụ.
                    }
                }
                catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
                {
                    // Dừng ứng dụng hoặc khởi động lại listener.
                }
                catch (Exception ex) when (cancellationToken.IsCancellationRequested)
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
                        "Lỗi nhận dữ liệu PLC {Remote}. " +
                        "Đóng kết nối này; server tiếp tục lắng nghe",
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
    }
}