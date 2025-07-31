#!/usr/bin/env python3
"""
Build script for ReconcileBook Desktop
Creates a single executable file
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Build the application"""
    print("Building ReconcileBook Desktop...")
    
    # Check if PyInstaller is installed
    try:
        import PyInstaller
    except ImportError:
        print("PyInstaller not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"])
    
    # Build command
    cmd = [
        "pyinstaller",
        "--onefile",  # Single executable
        "--windowed",  # No console window
        "--name=ReconcileBook",
        "--icon=assets/icon.ico" if Path("assets/icon.ico").exists() else "",
        "--add-data=src;src",  # Include source files
        "src/main.py"
    ]
    
    # Remove empty arguments
    cmd = [arg for arg in cmd if arg]
    
    print(f"Running: {' '.join(cmd)}")
    
    # Run PyInstaller
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print("Build successful!")
        print(f"Executable created in: dist/ReconcileBook.exe")
    else:
        print("Build failed!")
        print("Error:", result.stderr)
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 