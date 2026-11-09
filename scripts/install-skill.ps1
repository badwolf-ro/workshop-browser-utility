# Link skills/browser into ~/.claude/skills so every Claude Code session can use it.
# Uses a directory junction (no admin rights needed); edits in the repo take effect immediately.
$ErrorActionPreference = 'Stop'
$src = Join-Path (Split-Path $PSScriptRoot -Parent) 'skills\browser'
$skillsDir = Join-Path $env:USERPROFILE '.claude\skills'
$dest = Join-Path $skillsDir 'browser'

New-Item -ItemType Directory -Force $skillsDir | Out-Null
if (Test-Path $dest) {
    $item = Get-Item $dest -Force
    if ($item.LinkType -eq 'Junction' -and $item.Target -contains $src) {
        Write-Output "Already linked: $dest -> $src"
        exit 0
    }
    throw "$dest already exists and is not a junction to $src; remove it first."
}
New-Item -ItemType Junction -Path $dest -Target $src | Out-Null
Write-Output "Linked $dest -> $src"
