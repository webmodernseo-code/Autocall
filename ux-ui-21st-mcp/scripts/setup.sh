#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  UX.UI-21ST-MCP Setup & Initialization  "
echo "=========================================="

if command -v node >/dev/null 2>&1; then
    echo "[✓] Node.js detected: $(node -v)"
else
    echo "[!] Node.js not detected. Please install Node.js >= 18."
fi

if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Setup complete! You can run searches with:"
echo "  node scripts/search.mjs \"fintech dashboard\" --domain style"
