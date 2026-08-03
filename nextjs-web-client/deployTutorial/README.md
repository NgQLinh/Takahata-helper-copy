# Triển khai Next.js TypeScript trên Windows qua Port 80, không dùng IIS

Ứng dụng sẽ:

- Chạy Next.js Standalone bằng PM2.
- Không sử dụng IIS.
- Lắng nghe trên port `80`.
- Cho phép các máy khác trong mạng LAN truy cập bằng địa chỉ:

---

## 1. Yêu cầu

### Máy build

- Node.js LTS.
- npm.
- Source code của project Next.js.
- Project build thành công bằng `npm run build`.

### Máy Windows triển khai

- IP tĩnh: `xxx.xxx.x.xxx`.
- Node.js LTS.
- PM2 được cài qua npm.
- Quyền Administrator.
- Port `80` chưa bị ứng dụng khác sử dụng.

Kiểm tra Node.js:

```powershell
node --version
npm --version
```

Kiểm tra địa chỉ IP:

```powershell
ipconfig
```

---

## 2. Cấu hình Next.js Standalone

Mở file `next.config.ts` và thêm cấu hình:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

Nếu project sử dụng `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

module.exports = nextConfig;
```

Chế độ `standalone` giúp Next.js tạo một bản triển khai tối giản, không cần copy toàn bộ source code và toàn bộ thư mục `node_modules`.

---

## 3. Tạo script đóng gói tự động

Tạo file:

```text
scripts/build-deploy.ps1
```

Nội dung:

```powershell
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$deployPath = Join-Path $projectRoot "deploy"
$zipPath = Join-Path $projectRoot "next-app-deploy.zip"

Set-Location $projectRoot

Write-Host "Installing dependencies..."
npm ci

Write-Host "Building Next.js application..."
npm run build

Write-Host "Preparing deploy directory..."
Remove-Item $deployPath -Recurse -Force -ErrorAction SilentlyContinue
New-Item $deployPath -ItemType Directory | Out-Null

Copy-Item ".\.next\standalone\*" $deployPath -Recurse -Force

$staticPath = Join-Path $deployPath ".next\static"
New-Item $staticPath -ItemType Directory -Force | Out-Null
Copy-Item ".\.next\static\*" $staticPath -Recurse -Force

if (Test-Path ".\public") {
    Copy-Item ".\public" (Join-Path $deployPath "public") -Recurse -Force
}

Write-Host "Removing old ZIP file..."
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

Write-Host "Creating ZIP package..."
Compress-Archive `
    -Path (Join-Path $deployPath "*") `
    -DestinationPath $zipPath `
    -Force

Write-Host "Deploy package created successfully:"
Write-Host $deployPath

Write-Host "ZIP package created successfully:"
Write-Host $zipPath

```

Chạy script:

```powershell
powershell.exe -ExecutionPolicy Bypass -File ".\scripts\build-deploy.ps1"
```

---

## 4. Giải nén trên máy Windows triển khai

Tạo thư mục:

```text
C:\apps\next-app
```

Giải nén vào C:\apps\next-app Cấu trúc mong đợi:

```text
C:\apps\next-app\
├── .next\
├── node_modules\
├── public\
├── package.json
└── server.js
```

---

## 5. Kiểm tra port 80

Mở PowerShell bằng quyền **Run as Administrator**.

Kiểm tra port `80`:

```powershell
Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
```

Hoặc:

```powershell
netstat -ano | findstr ":80"
```

Nếu port đang bị chiếm, kết quả có thể giống:

```text
TCP    0.0.0.0:80    0.0.0.0:0    LISTENING    1234
```

Kiểm tra tiến trình theo PID:

```powershell
Get-Process -Id 1234
```

Các ứng dụng thường chiếm port `80`:

- IIS.
- Apache.
- Nginx.
- Ứng dụng Node.js khác.
- Phần mềm quản trị có web server tích hợp.

---

## 6. Tắt IIS nếu đang sử dụng port 80

Chỉ thực hiện nếu IIS đang chạy và không còn được sử dụng.

```powershell
Stop-Service W3SVC -Force -ErrorAction SilentlyContinue
Stop-Service WAS -Force -ErrorAction SilentlyContinue
```

Tắt tự khởi động:

```powershell
Set-Service W3SVC -StartupType Disabled -ErrorAction SilentlyContinue
Set-Service WAS -StartupType Disabled -ErrorAction SilentlyContinue
```

Kiểm tra lại port:

```powershell
Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
```

---

## 7. Mở port 80 trên Windows Firewall

Mở PowerShell bằng quyền Administrator:

```powershell
New-NetFirewallRule `
  -DisplayName "Next.js LAN Port 80" `
  -Direction Inbound `
  -Action Allow `
  -Protocol TCP `
  -LocalPort 80 `
  -Profile Private `
  -RemoteAddress LocalSubnet
```

Rule này chỉ cho phép các máy trong mạng nội bộ truy cập port `80`.

Kiểm tra rule:

```powershell
Get-NetFirewallRule -DisplayName "Next.js LAN Port 80"
```

Kiểm tra network profile:

```powershell
Get-NetConnectionProfile
```

Nếu card mạng đang ở profile `Public`, chuyển sang `Private`.

Thay `Ethernet` bằng tên card mạng thực tế:

```powershell
Set-NetConnectionProfile `
  -InterfaceAlias "Ethernet" `
  -NetworkCategory Private
```

---

## 8. Chạy thử ứng dụng trên server

Tại máy Windows triển khai:

```powershell
cd C:\apps\next-app

$env:NODE_ENV = "production"
$env:HOSTNAME = "0.0.0.0"
$env:PORT = "80"

node server.js
```

Kiểm tra trên chính server:

```text
http://localhost
```

Kiểm tra bằng PowerShell:

```powershell
Invoke-WebRequest "http://localhost" -UseBasicParsing
```

Kiểm tra từ máy khác trong LAN:

```text
http://xxx.xxx.x.xxx
```

---

## 9. Cài đặt và chạy ứng dụng bằng PM2

Mở PowerShell bằng quyền **Run as Administrator** và cài PM2 toàn cục:

```powershell
npm install -g pm2@latest
```

Kiểm tra PM2:

```powershell
pm2 --version
where.exe pm2.cmd
```

Tạo thư mục log:

```powershell
New-Item "C:\apps\next-app\logs" -ItemType Directory -Force
```

Tạo file cấu hình:

```text
C:\apps\next-app\ecosystem.config.cjs
```

Nội dung:

```javascript
module.exports = {
  apps: [
    {
      name: "next-app",
      script: "server.js",
      cwd: "C:\\apps\\next-app",

      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
        PORT: 80,

        // Khai báo biến môi trường runtime tại đây nếu cần.
        // Không đưa secret vào biến NEXT_PUBLIC_*.
        // DATABASE_URL: "...",
        // JWT_SECRET: "...",
        // API_SECRET: "...",
      },

      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      restart_delay: 3000,
      time: true,

      out_file: "C:\\apps\\next-app\\logs\\server.log",
      error_file: "C:\\apps\\next-app\\logs\\error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
```

Khởi động ứng dụng:

```powershell
cd C:\apps\next-app
pm2 start ecosystem.config.cjs
```

Kiểm tra trạng thái và log:

```powershell
pm2 list
pm2 describe next-app
pm2 logs next-app --lines 100
```

Kiểm tra HTTP:

```powershell
Invoke-WebRequest "http://localhost" -UseBasicParsing
```

Lưu danh sách tiến trình hiện tại để có thể khôi phục sau khi Windows khởi động lại:

```powershell
pm2 save
```

Các lệnh vận hành thường dùng:

```powershell
pm2 restart next-app --update-env
pm2 stop next-app
pm2 start next-app
pm2 delete next-app
pm2 monit
pm2 flush
```

> PM2 phải được chạy bằng cùng một tài khoản Windows trong các bước `pm2 start`, `pm2 save`, `pm2 resurrect` và khi tạo Scheduled Task. Mỗi tài khoản có thư mục `PM2_HOME` riêng.

---

## 10. Tự động khôi phục PM2 khi Windows khởi động

Trên Windows, dùng **Task Scheduler** để gọi `pm2 resurrect`. Lệnh này khôi phục danh sách tiến trình đã lưu bằng `pm2 save`.

Trước tiên, xác định đường dẫn PM2:

```powershell
where.exe pm2.cmd
```

Ví dụ kết quả:

```text
C:\Users\Administrator\AppData\Roaming\npm\pm2.cmd
```

Tạo file:

```text
C:\apps\start-pm2.cmd
```

Nội dung dưới đây cần thay `Administrator` bằng đúng tài khoản đã cài và chạy PM2:

```bat
@echo off
set PM2_HOME=C:\Users\Administrator\.pm2
call C:\Users\Administrator\AppData\Roaming\npm\pm2.cmd resurrect
```

```bat
whoami
```

Kết quả ví dụ:

```bat
DESKTOP-ABC123\annguyen
```

annguyen là tên máy

Chạy thử file và kiểm tra ứng dụng được khôi phục:

```powershell
C:\apps\start-pm2.cmd
pm2 list
```

Tạo Scheduled Task bằng PowerShell. Thay giá trị `$pm2User` bằng đúng tài khoản Windows đang chạy PM2:

```powershell
# Tài khoản Windows đang cài và chạy PM2
$pm2User = "desktop-dq3kh9a\an"

# Kiểm tra file start-pm2.cmd
$cmdPath = "C:\apps\start-pm2.cmd"

if (-not (Test-Path $cmdPath)) {
    throw "Không tìm thấy file: $cmdPath"
}

# Yêu cầu nhập mật khẩu Windows của tài khoản An
$credential = Get-Credential `
    -UserName $pm2User `
    -Message "Nhập mật khẩu Windows của tài khoản chạy PM2"

$password = $credential.GetNetworkCredential().Password

# Chạy file CMD thông qua cmd.exe
$action = New-ScheduledTaskAction `
    -Execute "C:\Windows\System32\cmd.exe" `
    -Argument "/c `"$cmdPath`"" `
    -WorkingDirectory "C:\apps"

# Chạy khi Windows khởi động
$trigger = New-ScheduledTaskTrigger -AtStartup

# Cấu hình tự khởi động lại khi lỗi
$settings = New-ScheduledTaskSettingsSet `
    -RestartCount 10 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -StartWhenAvailable `
    -ExecutionTimeLimit ([TimeSpan]::Zero)

# Đăng ký Scheduled Task
Register-ScheduledTask `
    -TaskName "PM2Resurrect" `
    -Description "Restore PM2 applications after Windows startup" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -User $pm2User `
    -Password $password `
    -RunLevel Highest `
    -Force
```

Windows sẽ yêu cầu mật khẩu của tài khoản khi đăng ký task. Có thể tạo thủ công trong Task Scheduler với các tùy chọn:

- **Run whether user is logged on or not**.
- **Run with highest privileges**.
- Trigger: **At startup**.
- Action: chạy `C:\apps\start-pm2.cmd`.
- Có thể đặt delay khoảng 30 giây.

Khởi động task ngay:

```powershell
Start-ScheduledTask -TaskName "PM2Resurrect"
```

Kiểm tra trạng thái:

```powershell
Get-ScheduledTask -TaskName "PM2Resurrect" |
  Get-ScheduledTaskInfo

pm2 list
```

Xóa task khi không còn sử dụng:

```powershell
Unregister-ScheduledTask `
  -TaskName "PM2Resurrect" `
  -Confirm:$false
```

Sau khi thay đổi danh sách ứng dụng PM2 hoặc cấu hình ecosystem, chạy lại:

```powershell
pm2 save
```

---

## 11. Kiểm tra dịch vụ

Kiểm tra tiến trình Node.js:

```powershell
Get-Process node -ErrorAction SilentlyContinue
```

Kiểm tra port `80`:

```powershell
Get-NetTCPConnection -LocalPort 80 -State Listen
```

Kết quả mong đợi:

```text
LocalAddress LocalPort State
------------ --------- -----
0.0.0.0      80        Listen
```

Kiểm tra HTTP:

```powershell
Invoke-WebRequest "http://localhost" -UseBasicParsing
```

Kiểm tra từ máy khác:

```powershell
Test-NetConnection xxx.xxx.x.xxx -Port 80
```

Kết quả mong đợi:

```text
TcpTestSucceeded : True
```

---

## 12. Truy cập từ máy khác trong LAN

Trên máy khác cùng mạng LAN, mở trình duyệt:

```text
http://xxx.xxx.x.xxx
```

Có thể kiểm tra bằng PowerShell:

```powershell
Test-NetConnection xxx.xxx.x.xxx -Port 80
```

Hoặc:

```powershell
Invoke-WebRequest "http://xxx.xxx.x.xxx" -UseBasicParsing
```

---

## 13. Cấu hình biến môi trường

### Biến server-side

Ví dụ:

```text
DATABASE_URL
JWT_SECRET
API_SECRET
```

Các biến này có thể được khai báo trong phần `env` của `ecosystem.config.cjs`:

```javascript
env: {
  NODE_ENV: "production",
  HOSTNAME: "0.0.0.0",
  PORT: 80,
  DATABASE_URL: "...",
  JWT_SECRET: "...",
}
```

Không commit secret vào Git.

### Biến NEXT_PUBLIC

Các biến bắt đầu bằng:

```text
NEXT_PUBLIC_
```

thường được nhúng vào JavaScript trong quá trình build.

Ví dụ:

```powershell
$env:NEXT_PUBLIC_API_URL = "http://xxx.xxx.x.xxx/api"

npm run build
```

Thay đổi `NEXT_PUBLIC_*` sau khi build có thể không làm thay đổi giá trị phía trình duyệt. Khi thay đổi các biến này, cần build lại ứng dụng.

---

## 14. Project sử dụng Prisma hoặc native package

Nếu project sử dụng các package như:

- Prisma.
- Sharp.
- bcrypt.
- canvas.
- SQLite native driver.
- Package có binary native.

Nên build trên:

- Chính máy Windows triển khai; hoặc
- Máy Windows có cùng kiến trúc CPU và cùng phiên bản major Node.js.

Không nên build trên Linux rồi copy trực tiếp thư mục standalone sang Windows nếu package có binary phụ thuộc hệ điều hành.

Với Prisma, nên chạy trước khi build:

```powershell
npx prisma generate
npm run build
```

Đảm bảo file Prisma engine dành cho Windows đã được đóng gói.

---

## 15. Quy trình cập nhật phiên bản mới

### Bước 1: Build bản mới

Chạy script tạo lại thư mục `deploy` và file ZIP.

### Bước 2: Dừng phiên bản hiện tại

Trên server:

```powershell
pm2 stop next-app
```

Xác nhận ứng dụng đã dừng:

```powershell
pm2 list
Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
```

### Bước 3: Backup bản cũ

```powershell
$backupName = "C:\apps\next-app-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

Rename-Item `
  "C:\apps\next-app" `
  $backupName
```

### Bước 4: Giải nén bản mới

```powershell
New-Item "C:\apps\next-app" -ItemType Directory -Force

Expand-Archive `
  -Path "C:\path\to\next-app-deploy.zip" `
  -DestinationPath "C:\apps\next-app" `
  -Force
```

Đảm bảo file `ecosystem.config.cjs` và thư mục `logs` vẫn tồn tại. Nên lưu cấu hình vận hành ngoài file ZIP hoặc copy lại sau khi giải nén để không bị ghi đè.

### Bước 5: Khởi động lại

Nếu process vẫn còn trong danh sách PM2:

```powershell
pm2 restart next-app --update-env
```

Nếu process đã bị xóa hoặc đường dẫn ứng dụng thay đổi:

```powershell
cd C:\apps\next-app
pm2 start ecosystem.config.cjs
```

Nếu muốn dừng để cập nhật

```powershell
pm2 stop next-app
```

Lưu trạng thái mới:

```powershell
pm2 save
```

Kiểm tra:

```powershell
Start-Sleep -Seconds 3

Invoke-WebRequest "http://localhost" -UseBasicParsing

Get-NetTCPConnection -LocalPort 80 -State Listen
```

---

## 16. Rollback phiên bản cũ

Dừng ứng dụng:

```powershell
pm2 stop next-app
```

Đổi tên phiên bản lỗi:

```powershell
Rename-Item `
  "C:\apps\next-app" `
  "C:\apps\next-app-failed"
```

Khôi phục backup:

```powershell
Rename-Item `
  "C:\apps\next-app-backup-YYYYMMDD-HHMMSS" `
  "C:\apps\next-app"
```

Khởi động lại và lưu trạng thái:

```powershell
cd C:\apps\next-app
pm2 restart next-app --update-env
pm2 save
```

---

## 17. Xử lý lỗi thường gặp

### Không truy cập được từ máy khác

Kiểm tra:

```powershell
Test-NetConnection xxx.xxx.x.xxx -Port 80
```

Kiểm tra server có lắng nghe trên `0.0.0.0` không:

```powershell
Get-NetTCPConnection -LocalPort 80 -State Listen
```

Nếu chỉ lắng nghe trên `127.0.0.1`, cần đặt:

```powershell
$env:HOSTNAME = "0.0.0.0"
```

### Ping được nhưng không truy cập được website

Nguyên nhân thường gặp:

- Windows Firewall chưa mở port.
- Node.js chưa chạy.
- Port `80` bị ứng dụng khác chiếm.
- Network profile đang là `Public`.
- Router bật AP Isolation hoặc Client Isolation.

### Lỗi `EADDRINUSE`

Ví dụ:

```text
Error: listen EADDRINUSE: address already in use 0.0.0.0:80
```

Port `80` đang bị chiếm.

Kiểm tra:

```powershell
netstat -ano | findstr ":80"
```

Sau đó kiểm tra PID:

```powershell
Get-Process -Id <PID>
```

### Static file hoặc ảnh không tải được

Đảm bảo đã copy:

```text
.next/static
public
```

Kiểm tra cấu trúc:

```text
C:\apps\next-app\.next\static
C:\apps\next-app\public
```

### Application chạy nhưng API hoặc database lỗi

Kiểm tra log:

```powershell
Get-Content "C:\apps\next-app\logs\server.log" -Tail 100
```

```powershell
Get-Content "C:\apps\next-app\logs\error.log" -Tail 100
```

Kiểm tra biến môi trường và khả năng kết nối database.

### PM2 báo online nhưng không thấy Node.js lắng nghe

Kiểm tra trạng thái PM2:

```powershell
pm2 describe next-app
```

Kiểm tra log lỗi:

```powershell
Get-Content "C:\apps\next-app\logs\error.log" -Tail 100
```

Hoặc xem trực tiếp bằng PM2:

```powershell
pm2 logs next-app --lines 100
```

Đảm bảo đường dẫn Node.js đúng:

```powershell
Test-Path "C:\Program Files\nodejs\node.exe"
```

---

## 18. Bộ lệnh kiểm tra nhanh

```powershell
# Kiểm tra IP
ipconfig

# Kiểm tra Node.js
node --version
npm --version

# Kiểm tra tiến trình Node
Get-Process node -ErrorAction SilentlyContinue

# Kiểm tra port 80
Get-NetTCPConnection -LocalPort 80 -State Listen

# Kiểm tra firewall
Get-NetFirewallRule -DisplayName "Next.js LAN Port 80"

# Kiểm tra HTTP trên server
Invoke-WebRequest "http://localhost" -UseBasicParsing

# Kiểm tra kết nối từ máy LAN khác
Test-NetConnection xxx.xxx.x.xxx -Port 80

# Kiểm tra PM2
pm2 list
pm2 describe next-app

# Xem log ứng dụng
pm2 logs next-app --out --lines 100

# Xem log lỗi
pm2 logs next-app --err --lines 100
```

---

## 19. URL sử dụng

Sau khi triển khai thành công, các máy trong mạng LAN truy cập:

```text
http://xxx.xxx.x.xxx
```

Không cần thêm port vì ứng dụng đang chạy trên port HTTP mặc định `80`.

---

## 20. Lưu ý bảo mật

Cấu hình này phù hợp cho mạng LAN nội bộ.

Khuyến nghị:

- Chỉ mở firewall cho `LocalSubnet`.
- Không cấu hình port forwarding từ Internet vào port `80`.
- Không lưu secret trong source code.
- Không dùng tài khoản Administrator để chạy ứng dụng nếu môi trường yêu cầu bảo mật cao.
- Sao lưu bản triển khai cũ trước mỗi lần cập nhật.
- Theo dõi file log và dung lượng ổ đĩa.
- Nếu cần HTTPS hoặc public Internet, nên đặt reverse proxy như Nginx, Caddy hoặc một giải pháp tương đương phía trước ứng dụng.

---

## 21. Tóm tắt quy trình

```text
1. Thêm output: "standalone" vào next.config.ts.
2. Chạy npm ci và npm run build.
3. Copy .next/standalone vào thư mục deploy.
4. Copy .next/static và public.
5. Chép bản deploy sang C:\apps\next-app.
6. Mở Windows Firewall port 80.
7. Chạy server với HOSTNAME=0.0.0.0 và PORT=80.
8. Chạy ứng dụng bằng PM2 và chạy `pm2 save`.
9. Tạo Scheduled Task gọi `pm2 resurrect` khi Windows khởi động.
10. Truy cập http://xxx.xxx.x.xxx từ máy khác trong LAN.
```
