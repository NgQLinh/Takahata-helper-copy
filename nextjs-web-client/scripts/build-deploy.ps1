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
