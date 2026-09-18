# Setup script for Windows PowerShell
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  UX.UI-21ST-MCP Setup & Initialization  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVer = node -v
    Write-Host "[✓] Node.js detected: $nodeVer" -ForegroundColor Green
} else {
    Write-Host "[!] Node.js is not installed. Please install Node.js >= 18." -ForegroundColor Yellow
}

# Check Python
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "[✓] Python detected" -ForegroundColor Green
} else {
    Write-Host "[i] Python not detected (Node search fallback active)" -ForegroundColor Gray
}

# Install dependencies if needed
if (Test-Path "package.json") {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host "`nSetup complete! You can now test search:" -ForegroundColor Green
Write-Host "  node scripts/search.mjs `"fintech dashboard`" --domain style" -ForegroundColor White
Write-Host "  npm run search `"saas minimal`"" -ForegroundColor White
