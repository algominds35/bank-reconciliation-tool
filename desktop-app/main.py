#!/usr/bin/env python3
"""
ReconcileBook Desktop - Local Bank Reconciliation Tool
Main application entry point
"""

import sys
import os
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from src.gui.main_window import ReconciliationApp

def main():
    """Main application entry point"""
    try:
        app = ReconciliationApp()
        app.run()
    except Exception as e:
        print(f"Error starting application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 