#!/usr/bin/env python3
"""
Build script for ReconcileBook Desktop with licensing
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def create_license_system():
    """Create a simple licensing system"""
    license_code = "RECONCILE2024"  # Simple demo license
    
    license_template = f'''
# License validation
def validate_license():
    """Simple license validation"""
    try:
        # In a real app, you'd check against a server or encrypted file
        return True
    except:
        return False

# Check license before starting
if not validate_license():
    print("Invalid license. Please contact support.")
    sys.exit(1)
'''
    
    return license_template

def build_executable():
    """Build the executable using PyInstaller"""
    
    # Install PyInstaller if not already installed
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller"], check=True)
    except subprocess.CalledProcessError:
        print("Failed to install PyInstaller")
        return False
    
    # Build command
    build_cmd = [
        "pyinstaller",
        "--onefile",  # Single executable
        "--windowed",  # No console window
        "--name=ReconcileBook-Desktop",
        "--add-data=sample_bank_transactions.csv;.",
        "--add-data=sample_quickbooks_transactions.csv;.",
        "simple_reconciliation_app.py"
    ]
    
    try:
        subprocess.run(build_cmd, check=True)
        print("✅ Executable built successfully!")
        print("📁 Check the 'dist' folder for ReconcileBook-Desktop.exe")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Build failed: {e}")
        return False

def create_installer():
    """Create a simple installer script"""
    installer_script = '''
@echo off
echo Installing ReconcileBook Desktop...
echo.
echo This will install ReconcileBook Desktop to your computer.
echo.
pause
echo Installing...
copy "ReconcileBook-Desktop.exe" "%USERPROFILE%\\Desktop\\"
echo.
echo Installation complete!
echo You can find ReconcileBook Desktop on your desktop.
pause
'''
    
    with open("install.bat", "w") as f:
        f.write(installer_script)
    
    print("✅ Installer script created: install.bat")

def create_payment_page():
    """Create a simple payment page for the desktop app"""
    payment_html = '''
<!DOCTYPE html>
<html>
<head>
    <title>ReconcileBook Desktop - Purchase</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; }
        .price { font-size: 48px; font-weight: bold; color: #2563eb; }
        .features { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { background: #2563eb; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; }
        .button:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ReconcileBook Desktop</h1>
        <p>Local Bank Reconciliation Tool</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <div class="price">$49</div>
        <p>One-time purchase • No monthly fees</p>
    </div>
    
    <div class="features">
        <h3>What you get:</h3>
        <ul>
            <li>✅ Desktop application (Windows/Mac)</li>
            <li>✅ No internet required</li>
            <li>✅ Data stays on your computer</li>
            <li>✅ CSV import/export</li>
            <li>✅ Smart transaction matching</li>
            <li>✅ PDF report generation</li>
            <li>✅ Lifetime updates</li>
        </ul>
    </div>
    
    <div style="text-align: center;">
        <button class="button" onclick="window.location.href='mailto:support@reconcilebook.com?subject=Desktop App Purchase'">
            Buy Now - Contact Support
        </button>
    </div>
    
    <div style="margin-top: 30px; text-align: center; color: #666;">
        <p>After payment, you'll receive:</p>
        <p>1. Download link for the executable</p>
        <p>2. Installation instructions</p>
        <p>3. License key</p>
    </div>
</body>
</html>
'''
    
    with open("desktop-purchase.html", "w", encoding="utf-8") as f:
        f.write(payment_html)
    
    print("✅ Payment page created: desktop-purchase.html")

if __name__ == "__main__":
    print("🔨 Building ReconcileBook Desktop...")
    
    # Create payment page
    create_payment_page()
    
    # Build executable
    if build_executable():
        create_installer()
        print("\n🎉 Build complete!")
        print("\n📋 Next steps:")
        print("1. Test ReconcileBook-Desktop.exe in the 'dist' folder")
        print("2. Upload desktop-purchase.html to your website")
        print("3. Set up payment processing (Stripe, PayPal, etc.)")
        print("4. Send executable + license to customers after payment")
    else:
        print("❌ Build failed!") 