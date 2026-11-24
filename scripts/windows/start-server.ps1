# 운영 서버 실행 (npm run build 를 먼저 해 둔 상태). 작업 스케줄러가 부팅 때 실행한다.
$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root
New-Item -ItemType Directory -Force "$root\logs" | Out-Null
$env:NODE_ENV = "production"
$port = if ($env:PORT) { $env:PORT } else { "3000" }
& npm.cmd start -- -p $port *>> "$root\logs\server.log"
