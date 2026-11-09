@echo off
rem pw - repo-local wrapper around Microsoft's playwright-cli (cmd / PowerShell).
setlocal
for %%I in ("%~dp0..") do set "ROOT=%%~fI"
if not defined PLAYWRIGHT_MCP_BROWSER set "PLAYWRIGHT_MCP_BROWSER=chromium"
if not defined PLAYWRIGHT_MCP_OUTPUT_DIR set "PLAYWRIGHT_MCP_OUTPUT_DIR=%ROOT%\.out"
node "%ROOT%\node_modules\@playwright\cli\playwright-cli.js" %*
