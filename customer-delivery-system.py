#!/usr/bin/env python3
"""
Customer Delivery System for ReconcileBook Desktop
"""

import os
import shutil
import zipfile
from pathlib import Path
import json

class CustomerDeliverySystem:
    def __init__(self):
        self.customer_data = {}
        self.load_customers()
    
    def load_customers(self):
        """Load customer data from file"""
        try:
            if os.path.exists('customers.json'):
                with open('customers.json', 'r') as f:
                    self.customer_data = json.load(f)
        except:
            self.customer_data = {}
    
    def save_customers(self):
        """Save customer data to file"""
        try:
            with open('customers.json', 'w') as f:
                json.dump(self.customer_data, f, indent=2)
        except Exception as e:
            print(f"Error saving customer data: {e}")
    
    def add_customer(self, email, name, company=""):
        """Add a new customer after payment"""
        customer_id = f"customer_{len(self.customer_data) + 1}"
        
        self.customer_data[customer_id] = {
            "email": email,
            "name": name,
            "company": company,
            "status": "paid",
            "download_sent": False,
            "date_purchased": str(Path().cwd().stat().st_mtime)
        }
        
        self.save_customers()
        return customer_id
    
    def create_customer_package(self, customer_id):
        """Create a package for the customer"""
        try:
            # Create customer folder
            customer_folder = Path(f"customer_packages/{customer_id}")
            customer_folder.mkdir(parents=True, exist_ok=True)
            
            # Copy the app
            shutil.copy("stable_reconciliation_app.py", customer_folder / "ReconcileBook-Desktop.py")
            
            # Copy sample data
            shutil.copy("sample_bank_transactions.csv", customer_folder / "sample_bank_transactions.csv")
            shutil.copy("sample_quickbooks_transactions.csv", customer_folder / "sample_quickbooks_transactions.csv")
            
            # Create installation instructions
            instructions = f"""
ReconcileBook Desktop - Installation Instructions

Customer: {self.customer_data[customer_id]['name']}
Email: {self.customer_data[customer_id]['email']}

INSTALLATION:
1. Make sure Python is installed on your computer
2. Double-click "ReconcileBook-Desktop.py" to run
3. Or open command prompt and run: python ReconcileBook-Desktop.py

USAGE:
1. Click "Select Bank File" to upload your bank CSV
2. Click "Select QuickBooks File" to upload your QB CSV
3. Click "Run Reconciliation" to match transactions
4. Click "Export Results" to save the report

SUPPORT:
- Email: support@reconcilebook.com
- Include your customer ID: {customer_id}

SAMPLE DATA:
- Use the included CSV files to test the app
- Replace with your actual bank and QuickBooks data

LICENSE:
- This is a one-time purchase
- No monthly fees
- Lifetime updates included
"""
            
            with open(customer_folder / "README.txt", "w") as f:
                f.write(instructions)
            
            # Create zip file
            zip_path = f"customer_packages/{customer_id}_package.zip"
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for file in customer_folder.rglob("*"):
                    zipf.write(file, file.name)
            
            return zip_path
            
        except Exception as e:
            print(f"Error creating package: {e}")
            return None
    
    def send_download_email(self, customer_id):
        """Simulate sending download email"""
        customer = self.customer_data.get(customer_id)
        if not customer:
            return False
        
        package_path = self.create_customer_package(customer_id)
        if not package_path:
            return False
        
        # Mark as sent
        self.customer_data[customer_id]["download_sent"] = True
        self.save_customers()
        
        print(f"✅ Download package created: {package_path}")
        print(f"📧 Email sent to: {customer['email']}")
        print(f"📦 Package includes: ReconcileBook-Desktop.py + sample data")
        
        return True
    
    def list_customers(self):
        """List all customers"""
        print("\n📋 Customer List:")
        print("=" * 50)
        
        for customer_id, data in self.customer_data.items():
            status = "✅ Sent" if data.get("download_sent") else "⏳ Pending"
            print(f"{customer_id}: {data['name']} ({data['email']}) - {status}")
    
    def process_payment(self, email, name, company=""):
        """Process a new payment"""
        print(f"\n💰 Processing payment for: {name} ({email})")
        
        # Add customer
        customer_id = self.add_customer(email, name, company)
        print(f"✅ Customer added: {customer_id}")
        
        # Send download
        if self.send_download_email(customer_id):
            print(f"✅ Download sent to {email}")
        else:
            print(f"❌ Failed to send download")
        
        return customer_id

def main():
    """Main function for customer delivery"""
    delivery = CustomerDeliverySystem()
    
    print("🎯 ReconcileBook Desktop - Customer Delivery System")
    print("=" * 50)
    
    while True:
        print("\nOptions:")
        print("1. Process new payment")
        print("2. List customers")
        print("3. Send download to customer")
        print("4. Exit")
        
        choice = input("\nEnter choice (1-4): ").strip()
        
        if choice == "1":
            email = input("Customer email: ").strip()
            name = input("Customer name: ").strip()
            company = input("Company (optional): ").strip()
            
            delivery.process_payment(email, name, company)
            
        elif choice == "2":
            delivery.list_customers()
            
        elif choice == "3":
            customer_id = input("Customer ID: ").strip()
            delivery.send_download_email(customer_id)
            
        elif choice == "4":
            print("Goodbye!")
            break
            
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main() 