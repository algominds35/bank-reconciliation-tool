#!/usr/bin/env python3
"""
Simple ReconcileBook Desktop - Local Bank Reconciliation Tool
"""

import customtkinter as ctk
from tkinter import filedialog, messagebox
import pandas as pd
from datetime import datetime
from decimal import Decimal
import threading
from pathlib import Path

class SimpleReconciliationApp:
    def __init__(self):
        # Configure CustomTkinter
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        
        # Data storage
        self.bank_transactions = []
        self.quickbooks_transactions = []
        self.matches = []
        
        # Create main window
        self.root = ctk.CTk()
        self.root.title("ReconcileBook Desktop")
        self.root.geometry("1000x700")
        
        self.setup_ui()
    
    def setup_ui(self):
        """Setup the main user interface"""
        # Title
        title_label = ctk.CTkLabel(
            self.root, 
            text="ReconcileBook Desktop", 
            font=ctk.CTkFont(size=24, weight="bold")
        )
        title_label.pack(pady=20)
        
        # File upload section
        upload_frame = ctk.CTkFrame(self.root)
        upload_frame.pack(fill="x", padx=20, pady=10)
        
        # Bank file
        bank_label = ctk.CTkLabel(upload_frame, text="Bank Transactions:", font=ctk.CTkFont(size=14, weight="bold"))
        bank_label.pack(pady=5)
        
        self.bank_file_label = ctk.CTkLabel(upload_frame, text="No file selected", text_color="gray")
        self.bank_file_label.pack()
        
        self.bank_button = ctk.CTkButton(
            upload_frame,
            text="Select Bank File",
            command=self.select_bank_file,
            width=150
        )
        self.bank_button.pack(pady=5)
        
        # QuickBooks file
        qb_label = ctk.CTkLabel(upload_frame, text="QuickBooks Transactions:", font=ctk.CTkFont(size=14, weight="bold"))
        qb_label.pack(pady=5)
        
        self.qb_file_label = ctk.CTkLabel(upload_frame, text="No file selected", text_color="gray")
        self.qb_file_label.pack()
        
        self.qb_button = ctk.CTkButton(
            upload_frame,
            text="Select QuickBooks File",
            command=self.select_quickbooks_file,
            width=150
        )
        self.qb_button.pack(pady=5)
        
        # Control buttons
        button_frame = ctk.CTkFrame(self.root)
        button_frame.pack(fill="x", padx=20, pady=10)
        
        self.reconcile_button = ctk.CTkButton(
            button_frame,
            text="Run Reconciliation",
            command=self.run_reconciliation,
            state="disabled"
        )
        self.reconcile_button.pack(side="left", padx=10, pady=10)
        
        self.export_button = ctk.CTkButton(
            button_frame,
            text="Export Results",
            command=self.export_results,
            state="disabled"
        )
        self.export_button.pack(side="left", padx=10, pady=10)
        
        # Results display
        self.results_text = ctk.CTkTextbox(self.root, height=300)
        self.results_text.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Status
        self.status_label = ctk.CTkLabel(self.root, text="Ready to import files")
        self.status_label.pack(pady=10)
    
    def select_bank_file(self):
        """Select bank file"""
        file_path = filedialog.askopenfilename(
            title="Select Bank CSV File",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        
        if file_path:
            self.bank_file_label.configure(text=Path(file_path).name, text_color="white")
            self.process_file(file_path, "bank")
    
    def select_quickbooks_file(self):
        """Select QuickBooks file"""
        file_path = filedialog.askopenfilename(
            title="Select QuickBooks CSV File",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        
        if file_path:
            self.qb_file_label.configure(text=Path(file_path).name, text_color="white")
            self.process_file(file_path, "quickbooks")
    
    def process_file(self, file_path: str, file_type: str):
        """Process CSV file"""
        try:
            self.status_label.configure(text=f"Processing {file_type} file...")
            self.root.update()
            
            # Read CSV
            df = pd.read_csv(file_path)
            
            # Basic processing - look for common column names
            date_col = None
            amount_col = None
            desc_col = None
            
            for col in df.columns:
                col_lower = col.lower()
                if 'date' in col_lower:
                    date_col = col
                elif 'amount' in col_lower or 'amt' in col_lower:
                    amount_col = col
                elif 'desc' in col_lower or 'memo' in col_lower:
                    desc_col = col
            
            if not all([date_col, amount_col, desc_col]):
                messagebox.showerror("Error", f"Could not find required columns in {file_type} file")
                return
            
            # Process transactions
            transactions = []
            for idx, row in df.iterrows():
                try:
                    # Parse date
                    date_str = str(row[date_col])
                    date = pd.to_datetime(date_str).date()
                    
                    # Parse amount
                    amount = float(row[amount_col])
                    
                    # Get description
                    description = str(row[desc_col])
                    
                    transactions.append({
                        'id': f"{file_type}_{idx}",
                        'date': date,
                        'description': description,
                        'amount': amount,
                        'source': file_type
                    })
                    
                except Exception as e:
                    continue
            
            if file_type == "bank":
                self.bank_transactions = transactions
            else:
                self.quickbooks_transactions = transactions
            
            self.status_label.configure(text=f"{file_type.title()} file processed: {len(transactions)} transactions")
            
            # Enable reconcile button if both files loaded
            if self.bank_transactions and self.quickbooks_transactions:
                self.reconcile_button.configure(state="normal")
                self.status_label.configure(text="Ready to reconcile")
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to process {file_type} file: {e}")
            self.status_label.configure(text="Ready to import files")
    
    def run_reconciliation(self):
        """Run reconciliation"""
        if not self.bank_transactions or not self.quickbooks_transactions:
            messagebox.showwarning("Warning", "Please load both files first")
            return
        
        try:
            self.status_label.configure(text="Running reconciliation...")
            self.root.update()
            
            # Simple matching algorithm
            matches = []
            matched_bank_ids = set()
            matched_qb_ids = set()
            
            for bank_tx in self.bank_transactions:
                best_match = None
                best_score = 0
                
                for qb_tx in self.quickbooks_transactions:
                    if qb_tx['id'] in matched_qb_ids:
                        continue
                    
                    # Calculate match score
                    amount_match = abs(bank_tx['amount'] - qb_tx['amount']) < 0.01
                    date_match = abs((bank_tx['date'] - qb_tx['date']).days) <= 3
                    desc_similarity = self.calculate_similarity(bank_tx['description'], qb_tx['description'])
                    
                    score = 0
                    if amount_match:
                        score += 0.4
                    if date_match:
                        score += 0.3
                    if desc_similarity > 0.7:
                        score += 0.3
                    
                    if score > best_score and score >= 0.7:
                        best_score = score
                        best_match = qb_tx
                
                if best_match:
                    matches.append({
                        'bank': bank_tx,
                        'quickbooks': best_match,
                        'confidence': best_score
                    })
                    matched_bank_ids.add(bank_tx['id'])
                    matched_qb_ids.add(best_match['id'])
            
            self.matches = matches
            
            # Display results
            self.display_results()
            
            self.export_button.configure(state="normal")
            self.status_label.configure(text=f"Reconciliation complete: {len(matches)} matches found")
            
        except Exception as e:
            messagebox.showerror("Error", f"Reconciliation failed: {e}")
            self.status_label.configure(text="Ready to reconcile")
    
    def calculate_similarity(self, str1: str, str2: str) -> float:
        """Calculate string similarity"""
        str1 = str1.lower().strip()
        str2 = str2.lower().strip()
        
        # Simple similarity calculation
        words1 = set(str1.split())
        words2 = set(str2.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def display_results(self):
        """Display reconciliation results"""
        self.results_text.delete("1.0", "end")
        
        if not self.matches:
            self.results_text.insert("1.0", "No matches found.")
            return
        
        # Summary
        summary = f"Reconciliation Results\n"
        summary += f"===================\n"
        summary += f"Total matches: {len(self.matches)}\n"
        summary += f"Average confidence: {sum(m['confidence'] for m in self.matches) / len(self.matches) * 100:.1f}%\n\n"
        
        # Matches
        summary += "Matches:\n"
        summary += "--------\n"
        
        for i, match in enumerate(self.matches[:20], 1):  # Show first 20
            summary += f"{i}. {match['bank']['description'][:50]}...\n"
            summary += f"   Bank: ${match['bank']['amount']:.2f} ({match['bank']['date']})\n"
            summary += f"   QB:   ${match['quickbooks']['amount']:.2f} ({match['quickbooks']['date']})\n"
            summary += f"   Confidence: {match['confidence'] * 100:.1f}%\n\n"
        
        if len(self.matches) > 20:
            summary += f"... and {len(self.matches) - 20} more matches\n"
        
        self.results_text.insert("1.0", summary)
    
    def export_results(self):
        """Export results to file"""
        if not self.matches:
            messagebox.showwarning("Warning", "No results to export")
            return
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt")],
            title="Save Results"
        )
        
        if file_path:
            try:
                with open(file_path, 'w') as f:
                    f.write("ReconcileBook Desktop - Reconciliation Report\n")
                    f.write("=" * 50 + "\n\n")
                    f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                    
                    f.write(f"Total matches: {len(self.matches)}\n")
                    f.write(f"Average confidence: {sum(m['confidence'] for m in self.matches) / len(self.matches) * 100:.1f}%\n\n")
                    
                    f.write("Matches:\n")
                    f.write("-" * 20 + "\n")
                    
                    for i, match in enumerate(self.matches, 1):
                        f.write(f"{i}. Bank: {match['bank']['description']} (${match['bank']['amount']:.2f})\n")
                        f.write(f"   QB:   {match['quickbooks']['description']} (${match['quickbooks']['amount']:.2f})\n")
                        f.write(f"   Confidence: {match['confidence'] * 100:.1f}%\n\n")
                
                messagebox.showinfo("Success", f"Results saved to:\n{file_path}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save results: {e}")
    
    def run(self):
        """Start the application"""
        self.root.mainloop()

if __name__ == "__main__":
    app = SimpleReconciliationApp()
    app.run() 