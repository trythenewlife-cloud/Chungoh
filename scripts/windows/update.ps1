# 새 코드 반영: 받아오기, 설치, DB 구조 반영, 빌드, 서버 재시작. 관리자 권한 PowerShell 에서 실행.
$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root
git pull --ff-only
npm.cmd ci
npm.cmd run db:push
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw "빌드 실패. 서버는 이전 버전으로 계속 실행 중입니다." }
Stop-ScheduledTask -TaskName "Chungoh Server"
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match "next" -and $_.CommandLine -match [regex]::Escape("$root") } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Start-ScheduledTask -TaskName "Chungoh Server"
Write-Host "업데이트 완료"
