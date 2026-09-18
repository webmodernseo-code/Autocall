#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick wrapper for UI/UX Pro Max search engine.
Forwards all queries and flags to src/ui-ux-pro-max/scripts/search.py.
"""

import os
import sys
import subprocess

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
ENGINE_DIR = os.path.join(REPO_ROOT, "src", "ui-ux-pro-max", "scripts")
ENGINE_SCRIPT = os.path.join(ENGINE_DIR, "search.py")

if __name__ == "__main__":
    if not os.path.exists(ENGINE_SCRIPT):
        print(f"Error: Engine script not found at {ENGINE_SCRIPT}", file=sys.stderr)
        sys.exit(1)

    cmd = [sys.executable, ENGINE_SCRIPT] + sys.argv[1:]
    res = subprocess.run(cmd, cwd=ENGINE_DIR)
    sys.exit(res.returncode)
