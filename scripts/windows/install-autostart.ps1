# 부팅할 때 서버와 터널을 자동 실행하도록 작업 스케줄러에 등록. 관리자 권한 PowerShell 에서 한 번 실행.
#   powershell -ExecutionPolicy Bypass -File scripts\windows\install-autostart.ps1
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$trigger = New-ScheduledTaskTrigger -AtStartup

foreach ($t in @(@{ Name = "Chungoh Server"; File = "start-server.ps1" }, @{ Name = "Chungoh Tunnel"; File = "start-tunnel.ps1" })) {
  $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$here\$($t.File)`""
  Register-ScheduledTask -TaskName $t.Name -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null
  Start-ScheduledTask -TaskName $t.Name
  Write-Host "등록하고 시작함: $($t.Name)"
}
Write-Host "임시 터널 주소 확인: Select-String -Path logs\tunnel.log -Pattern 'https://.*trycloudflare.com' | Select-Object -Last 1"
