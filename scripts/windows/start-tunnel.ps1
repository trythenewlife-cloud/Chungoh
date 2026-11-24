# Cloudflare 터널 실행.
# - 고정 주소: Cloudflare 대시보드에서 만든 터널 토큰을 CLOUDFLARE_TUNNEL_TOKEN 환경변수에 넣으면 그 터널로 연결
# - 토큰이 없으면 임시 터널 (*.trycloudflare.com, 실행할 때마다 주소가 바뀜). 주소는 logs\tunnel.log 에 기록
# cloudflared 는 정상 로그도 stderr 로 쓰므로 PowerShell 리디렉션 대신 cmd 로 파일에 남긴다.
$root = Resolve-Path "$PSScriptRoot\..\.."
New-Item -ItemType Directory -Force "$root\logs" | Out-Null
$port = if ($env:PORT) { $env:PORT } else { "3000" }
$exe = (Get-Command cloudflared -ErrorAction SilentlyContinue).Source
if (-not $exe) { $exe = "C:\Program Files (x86)\cloudflared\cloudflared.exe" }
$log = "$root\logs\tunnel.log"
if ($env:CLOUDFLARE_TUNNEL_TOKEN) {
  cmd.exe /c "`"$exe`" tunnel --no-autoupdate run --token $env:CLOUDFLARE_TUNNEL_TOKEN >> `"$log`" 2>&1"
} else {
  cmd.exe /c "`"$exe`" tunnel --no-autoupdate --url http://localhost:$port >> `"$log`" 2>&1"
}
exit $LASTEXITCODE
