#!/usr/bin/env python3
"""
Stable ReconcileBook Desktop - Local Bank Reconciliation Tool
"""

import customtkinter as ctk
from tkinter import filedialog, messagebox
import pandas as pd
from datetime import datetime
from decimal import Decimal
import threading
from pathlib import Path
import sys
import traceback

class StableReconciliationApp:
    def __init__(self):
        try:
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
            
            # Prevent window from closing unexpectedly
            self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
            
            self.setup_ui()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to initialize app: {str(e)}")
            sys.exit(1)
    
    def on_closing(self):
        """Handle window closing properly"""
        try:
            if messagebox.askokcancel("Quit", "Do you want to quit?"):
                self.root.quit()
                self.root.destroy()
        except:
            # Force close if there's an error
            try:
                self.root.destroy()
            except:
                pass
    
    def setup_ui(self):
        """Setup the main user interface"""
        try:
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
            
            # Status bar
            self.status_label = ctk.CTkLabel(self.root, text="Ready", text_color="gray")
            self.status_label.pack(pady=5)
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to setup UI: {str(e)}")
            raise
    
    def select_bank_file(self):
        """Select bank transactions file"""
        try:
            file_path = filedialog.askopenfilename(
                title="Select Bank Transactions File",
                filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
            )
            
            if file_path:
                self.process_file(file_path, "bank")
                self.bank_file_label.configure(text=Path(file_path).name)
                self.update_buttons()
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load bank file: {str(e)}")
    
    def select_quickbooks_file(self):
        """Select QuickBooks transactions file"""
        try:
            file_path = filedialog.askopenfilename(
                title="Select QuickBooks Transactions File",
                filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
            )
            
            if file_path:
                self.process_file(file_path, "quickbooks")
                self.qb_file_label.configure(text=Path(file_path).name)
                self.update_buttons()
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load QuickBooks file: {str(e)}")
    
    def process_file(self, file_path: str, file_type: str):
        """Process CSV file and extract transactions"""
        try:
            self.status_label.configure(text=f"Processing {file_type} file...")
            
            # Read CSV file
            df = pd.read_csv(file_path)
            
            # Detect column names (case insensitive)
            date_col = None
            desc_col = None
            amount_col = None
            
            for col in df.columns:
                col_lower = col.lower()
                if 'date' in col_lower:
                    date_col = col
                elif 'desc' in col_lower or 'description' in col_lower or 'memo' in col_lower:
                    desc_col = col
                elif 'amount' in col_lower or 'debit' in col_lower or 'credit' in col_lower:
                    amount_col = col
            
            # If columns not found, use first few columns
            if not date_col and len(df.columns) > 0:
                date_col = df.columns[0]
            if not desc_col and len(df.columns) > 1:
                desc_col = df.columns[1]
            if not amount_col and len(df.columns) > 2:
                amount_col = df.columns[2]
            
            transactions = []
            
            for idx, row in df.iterrows():
                try:
                    # Extract data with error handling
                    date = str(row.get(date_col, '')) if date_col else ''
                    description = str(row.get(desc_col, '')) if desc_col else ''
                    amount_str = str(row.get(amount_col, 0)) if amount_col else '0'
                    
                    # Clean amount
                    amount_str = amount_str.replace('$', '').replace(',', '').strip()
                    try:
                        amount = float(amount_str)
                    except:
                        amount = 0.0
                    
                    transactions.append({
                        'id': f"{file_type}_{idx}",
                        'date': date,
                        'description': description,
                        'amount': amount,
                        'source': file_type
                    })
                    
                except Exception as e:
                    print(f"Error processing row {idx}: {e}")
                    continue
            
            # Store transactions
            if file_type == "bank":
                self.bank_transactions = transactions
            else:
                self.quickbooks_transactions = transactions
            
            self.status_label.configure(text=f"Loaded {len(transactions)} {file_type} transactions")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to process {file_type} file: {str(e)}")
            self.status_label.configure(text="Error processing file")
    
    def update_buttons(self):
        """Update button states based on loaded files"""
        if self.bank_transactions and self.quickbooks_transactions:
            self.reconcile_button.configure(state="normal")
        else:
            self.reconcile_button.configure(state="disabled")
    
    def run_reconciliation(self):
        """Run the reconciliation process"""
        try:
            self.status_label.configure(text="Running reconciliation...")
            self.reconcile_button.configure(state="disabled")
            
            # Run in thread to prevent UI freezing
            thread = threading.Thread(target=self._run_reconciliation_thread)
            thread.daemon = True
            thread.start()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start reconciliation: {str(e)}")
            self.status_label.configure(text="Error")
            self.reconcile_button.configure(state="normal")
    
    def _run_reconciliation_thread(self):
        """Run reconciliation in background thread"""
        try:
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
                    score = 0
                    
                    # Amount match (exact)
                    if abs(bank_tx['amount'] - qb_tx['amount']) < 0.01:
                        score += 50
                    
                    # Date similarity
                    try:
                        bank_date = datetime.strptime(bank_tx['date'], '%Y-%m-%d')
                        qb_date = datetime.strptime(qb_tx['date'], '%Y-%m-%d')
                        date_diff = abs((bank_date - qb_date).days)
                        if date_diff <= 7:
                            score += 20
                        elif date_diff <= 30:
                            score += 10
                    except:
                        pass
                    
                    # Description similarity
                    similarity = self.calculate_similarity(
                        bank_tx['description'].lower(), 
                        qb_tx['description'].lower()
                    )
                    score += similarity * 30
                    
                    if score > best_score and score > 30:  # Minimum threshold
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
            
            # Update UI in main thread
            self.root.after(0, self._update_ui_after_reconciliation)
            
        except Exception as e:
            self.root.after(0, lambda: self._show_error(f"Reconciliation failed: {str(e)}"))
    
    def _update_ui_after_reconciliation(self):
        """Update UI after reconciliation completes"""
        try:
            self.display_results()
            self.export_button.configure(state="normal")
            self.reconcile_button.configure(state="normal")
            self.status_label.configure(text=f"Found {len(self.matches)} matches")
        except Exception as e:
            self._show_error(f"Failed to update UI: {str(e)}")
    
    def _show_error(self, message):
        """Show error message"""
        messagebox.showerror("Error", message)
        self.status_label.configure(text="Error")
        self.reconcile_button.configure(state="normal")
    
    def calculate_similarity(self, str1: str, str2: str) -> float:
        """Calculate string similarity"""
        try:
            if not str1 or not str2:
                return 0.0
            
            # Simple word overlap
            words1 = set(str1.split())
            words2 = set(str2.split())
            
            if not words1 or not words2:
                return 0.0
            
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            
            return len(intersection) / len(union) if union else 0.0
            
        except:
            return 0.0
    
    def display_results(self):
        """Display reconciliation results"""
        try:
            self.results_text.delete("1.0", "end")
            
            if not self.matches:
                self.results_text.insert("1.0", "No matches found.\n\nTry uploading different files or check your data format.")
                return
            
            # Calculate average confidence
            avg_confidence = sum(match['confidence'] for match in self.matches) / len(self.matches)
            
            result_text = f"""Reconciliation Results
{'='*50}

Total matches: {len(self.matches)}
Average confidence: {avg_confidence:.1f}%

Matches:
"""
            
            for i, match in enumerate(self.matches, 1):
                bank = match['bank']
                qb = match['quickbooks']
                confidence = match['confidence']
                
                result_text += f"""
{i}. {bank['description'][:50]}...
   Bank: ${bank['amount']:.2f} ({bank['date']})
   QB: ${qb['amount']:.2f} ({qb['date']})
   Confidence: {confidence:.1f}%
"""
            
            self.results_text.insert("1.0", result_text)
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to display results: {str(e)}")
    
    def export_results(self):
        """Export results to file"""
        try:
            if not self.matches:
                messagebox.showwarning("Warning", "No results to export")
                return
            
            file_path = filedialog.asksaveasfilename(
                title="Save Results",
                defaultextension=".txt",
                filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
            )
            
            if file_path:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write("ReconcileBook Desktop - Reconciliation Report\n")
                    f.write("=" * 50 + "\n\n")
                    f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                    f.write(f"Total matches: {len(self.matches)}\n")
                    
                    avg_confidence = sum(match['confidence'] for match in self.matches) / len(self.matches)
                    f.write(f"Average confidence: {avg_confidence:.1f}%\n\n")
                    
                    f.write("Matches:\n")
                    f.write("-" * 30 + "\n")
                    
                    for i, match in enumerate(self.matches, 1):
                        bank = match['bank']
                        qb = match['quickbooks']
                        confidence = match['confidence']
                        
                        f.write(f"\n{i}. {bank['description']}\n")
                        f.write(f"   Bank: ${bank['amount']:.2f} ({bank['date']})\n")
                        f.write(f"   QB: ${qb['amount']:.2f} ({qb['date']})\n")
                        f.write(f"   Confidence: {confidence:.1f}%\n")
                
                messagebox.showinfo("Success", f"Results exported to {file_path}")
                self.status_label.configure(text=f"Exported to {Path(file_path).name}")
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to export results: {str(e)}")
    
    def run(self):
        """Start the application with error handling"""
        try:
            # Keep the app running
            self.root.mainloop()
        except KeyboardInterrupt:
            print("App interrupted by user")
        except Exception as e:
            messagebox.showerror("Critical Error", f"Application error: {str(e)}")
            # Don't exit, try to keep running
            try:
                self.root.mainloop()
            except:
                pass
        finally:
            # Clean shutdown
            try:
                self.root.destroy()
            except:
                pass

def main():
    """Main entry point"""
    try:
        app = StableReconciliationApp()
        app.run()
    except Exception as e:
        print(f"Failed to start application: {e}")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main() 