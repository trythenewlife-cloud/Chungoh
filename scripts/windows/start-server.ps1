# 운영 서버 실행 (npm run build 를 먼저 해 둔 상태). 작업 스케줄러가 부팅 때 실행한다.
# npm 경고가 stderr 로 나와도 멈추지 않도록 PowerShell 리디렉션 대신 cmd 로 파일에 남긴다.
$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root
New-Item -ItemType Directory -Force "$root\logs" | Out-Null
$env:NODE_ENV = "production"
$port = if ($env:PORT) { $env:PORT } else { "3000" }
cmd.exe /c "npm.cmd start -- -p $port >> `"$root\logs\server.log`" 2>&1"
exit $LASTEXITCODE
