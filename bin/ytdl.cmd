@echo off
rem ytdl - repo-local wrapper around yt-dlp (cmd / PowerShell).
setlocal
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
if not defined YTDL_OUT_DIR set "YTDL_OUT_DIR=%ROOT%\.out\downloads"
"%ROOT%\vendor\yt-dlp.exe" -P "%YTDL_OUT_DIR%" %*
