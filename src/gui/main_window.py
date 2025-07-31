"""
Main application window for the reconciliation tool
"""

import customtkinter as ctk
from tkinter import filedialog, messagebox
import threading
from pathlib import Path
import logging

from ..core.processor import CSVProcessor
from ..core.matcher import TransactionMatcher
from ..utils.pdf_generator import PDFGenerator
from .file_upload import FileUploadFrame
from .transaction_view import TransactionViewFrame

logger = logging.getLogger(__name__)

class ReconciliationApp:
    """Main application class"""
    
    def __init__(self):
        # Configure CustomTkinter
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        
        # Initialize components
        self.processor = CSVProcessor()
        self.matcher = TransactionMatcher()
        self.pdf_generator = PDFGenerator()
        
        # Data storage
        self.bank_transactions = []
        self.quickbooks_transactions = []
        self.reconciliation_result = None
        
        # Create main window
        self.root = ctk.CTk()
        self.root.title("ReconcileBook Desktop")
        self.root.geometry("1200x800")
        self.root.minsize(1000, 600)
        
        self.setup_ui()
        self.setup_menu()
    
    def setup_ui(self):
        """Setup the main user interface"""
        # Configure grid
        self.root.grid_columnconfigure(0, weight=1)
        self.root.grid_rowconfigure(1, weight=1)
        
        # Header
        header_frame = ctk.CTkFrame(self.root)
        header_frame.grid(row=0, column=0, sticky="ew", padx=10, pady=10)
        header_frame.grid_columnconfigure(1, weight=1)
        
        # Title
        title_label = ctk.CTkLabel(
            header_frame, 
            text="ReconcileBook Desktop", 
            font=ctk.CTkFont(size=24, weight="bold")
        )
        title_label.grid(row=0, column=0, padx=20, pady=10)
        
        # Status
        self.status_label = ctk.CTkLabel(
            header_frame, 
            text="Ready to import files", 
            font=ctk.CTkFont(size=14)
        )
        self.status_label.grid(row=0, column=1, padx=20, pady=10, sticky="e")
        
        # Main content area
        main_frame = ctk.CTkFrame(self.root)
        main_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=(0, 10))
        main_frame.grid_columnconfigure(0, weight=1)
        main_frame.grid_rowconfigure(1, weight=1)
        
        # File upload section
        self.file_upload = FileUploadFrame(
            main_frame, 
            on_bank_file_selected=self.on_bank_file_selected,
            on_quickbooks_file_selected=self.on_quickbooks_file_selected
        )
        self.file_upload.grid(row=0, column=0, sticky="ew", padx=10, pady=10)
        
        # Transaction view section
        self.transaction_view = TransactionViewFrame(main_frame)
        self.transaction_view.grid(row=1, column=0, sticky="nsew", padx=10, pady=10)
        
        # Control buttons
        button_frame = ctk.CTkFrame(main_frame)
        button_frame.grid(row=2, column=0, sticky="ew", padx=10, pady=10)
        button_frame.grid_columnconfigure(0, weight=1)
        button_frame.grid_columnconfigure(1, weight=1)
        button_frame.grid_columnconfigure(2, weight=1)
        
        # Run reconciliation button
        self.reconcile_button = ctk.CTkButton(
            button_frame,
            text="Run Reconciliation",
            command=self.run_reconciliation,
            state="disabled"
        )
        self.reconcile_button.grid(row=0, column=0, padx=10, pady=10)
        
        # Export PDF button
        self.export_button = ctk.CTkButton(
            button_frame,
            text="Export PDF Report",
            command=self.export_pdf,
            state="disabled"
        )
        self.export_button.grid(row=0, column=1, padx=10, pady=10)
        
        # Clear data button
        self.clear_button = ctk.CTkButton(
            button_frame,
            text="Clear All Data",
            command=self.clear_data,
            fg_color="red",
            hover_color="darkred"
        )
        self.clear_button.grid(row=0, column=2, padx=10, pady=10)
    
    def setup_menu(self):
        """Setup application menu"""
        menubar = ctk.CTkFrame(self.root, height=30)
        menubar.grid(row=0, column=0, sticky="ew", padx=10, pady=(5, 0))
        
        # File menu
        file_button = ctk.CTkButton(
            menubar,
            text="File",
            command=self.show_file_menu,
            width=60,
            height=25
        )
        file_button.pack(side="left", padx=5)
        
        # Help menu
        help_button = ctk.CTkButton(
            menubar,
            text="Help",
            command=self.show_help,
            width=60,
            height=25
        )
        help_button.pack(side="right", padx=5)
    
    def on_bank_file_selected(self, file_path: str):
        """Handle bank file selection"""
        try:
            self.status_label.configure(text="Processing bank file...")
            self.root.update()
            
            # Process in thread to avoid blocking UI
            def process_file():
                try:
                    self.bank_transactions = self.processor.process_csv(file_path, "bank")
                    self.root.after(0, self.on_file_processed, "bank")
                except Exception as e:
                    self.root.after(0, self.on_file_error, str(e))
            
            threading.Thread(target=process_file, daemon=True).start()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to process bank file: {e}")
            self.status_label.configure(text="Ready to import files")
    
    def on_quickbooks_file_selected(self, file_path: str):
        """Handle QuickBooks file selection"""
        try:
            self.status_label.configure(text="Processing QuickBooks file...")
            self.root.update()
            
            # Process in thread to avoid blocking UI
            def process_file():
                try:
                    self.quickbooks_transactions = self.processor.process_csv(file_path, "quickbooks")
                    self.root.after(0, self.on_file_processed, "quickbooks")
                except Exception as e:
                    self.root.after(0, self.on_file_error, str(e))
            
            threading.Thread(target=process_file, daemon=True).start()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to process QuickBooks file: {e}")
            self.status_label.configure(text="Ready to import files")
    
    def on_file_processed(self, file_type: str):
        """Handle successful file processing"""
        self.status_label.configure(text=f"{file_type.title()} file processed successfully")
        
        # Update file upload display
        self.file_upload.update_file_status(file_type, True)
        
        # Enable reconcile button if both files are loaded
        if self.bank_transactions and self.quickbooks_transactions:
            self.reconcile_button.configure(state="normal")
            self.status_label.configure(text="Ready to reconcile")
    
    def on_file_error(self, error_message: str):
        """Handle file processing error"""
        messagebox.showerror("Processing Error", error_message)
        self.status_label.configure(text="Ready to import files")
    
    def run_reconciliation(self):
        """Run the reconciliation process"""
        if not self.bank_transactions or not self.quickbooks_transactions:
            messagebox.showwarning("Warning", "Please load both bank and QuickBooks files first")
            return
        
        try:
            self.status_label.configure(text="Running reconciliation...")
            self.reconcile_button.configure(state="disabled")
            self.root.update()
            
            # Run in thread to avoid blocking UI
            def reconcile():
                try:
                    self.reconciliation_result = self.matcher.find_matches(
                        self.bank_transactions, 
                        self.quickbooks_transactions
                    )
                    self.root.after(0, self.on_reconciliation_complete)
                except Exception as e:
                    self.root.after(0, self.on_reconciliation_error, str(e))
            
            threading.Thread(target=reconcile, daemon=True).start()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to run reconciliation: {e}")
            self.status_label.configure(text="Ready to reconcile")
            self.reconcile_button.configure(state="normal")
    
    def on_reconciliation_complete(self):
        """Handle successful reconciliation"""
        self.status_label.configure(text="Reconciliation complete")
        self.reconcile_button.configure(state="normal")
        self.export_button.configure(state="normal")
        
        # Update transaction view
        self.transaction_view.update_data(self.reconciliation_result)
        
        # Show summary
        stats = self.reconciliation_result.get_summary_stats()
        messagebox.showinfo(
            "Reconciliation Complete",
            f"Reconciliation completed successfully!\n\n"
            f"Total matches: {stats['total_matches']}\n"
            f"Perfect matches: {stats['perfect_matches']}\n"
            f"Unmatched bank transactions: {stats['unmatched_bank']}\n"
            f"Unmatched QuickBooks transactions: {stats['unmatched_quickbooks']}"
        )
    
    def on_reconciliation_error(self, error_message: str):
        """Handle reconciliation error"""
        messagebox.showerror("Reconciliation Error", error_message)
        self.status_label.configure(text="Ready to reconcile")
        self.reconcile_button.configure(state="normal")
    
    def export_pdf(self):
        """Export reconciliation results to PDF"""
        if not self.reconciliation_result:
            messagebox.showwarning("Warning", "No reconciliation results to export")
            return
        
        try:
            file_path = filedialog.asksaveasfilename(
                defaultextension=".pdf",
                filetypes=[("PDF files", "*.pdf")],
                title="Save PDF Report"
            )
            
            if file_path:
                self.status_label.configure(text="Generating PDF report...")
                self.root.update()
                
                # Generate in thread
                def generate_pdf():
                    try:
                        self.pdf_generator.generate_report(
                            self.reconciliation_result, 
                            file_path
                        )
                        self.root.after(0, self.on_pdf_exported, file_path)
                    except Exception as e:
                        self.root.after(0, self.on_pdf_error, str(e))
                
                threading.Thread(target=generate_pdf, daemon=True).start()
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to export PDF: {e}")
            self.status_label.configure(text="Ready to export")
    
    def on_pdf_exported(self, file_path: str):
        """Handle successful PDF export"""
        self.status_label.configure(text="PDF report exported successfully")
        messagebox.showinfo(
            "Export Complete", 
            f"PDF report saved to:\n{file_path}"
        )
    
    def on_pdf_error(self, error_message: str):
        """Handle PDF export error"""
        messagebox.showerror("Export Error", error_message)
        self.status_label.configure(text="Ready to export")
    
    def clear_data(self):
        """Clear all loaded data"""
        if messagebox.askyesno("Clear Data", "Are you sure you want to clear all data?"):
            self.bank_transactions = []
            self.quickbooks_transactions = []
            self.reconciliation_result = None
            
            self.file_upload.clear_files()
            self.transaction_view.clear_data()
            
            self.reconcile_button.configure(state="disabled")
            self.export_button.configure(state="disabled")
            
            self.status_label.configure(text="Ready to import files")
    
    def show_file_menu(self):
        """Show file menu options"""
        # Simple file menu for now
        pass
    
    def show_help(self):
        """Show help information"""
        help_text = """
ReconcileBook Desktop - Help

1. Import Files:
   - Click "Select Bank File" to load your bank CSV export
   - Click "Select QuickBooks File" to load your QuickBooks CSV export

2. Run Reconciliation:
   - Click "Run Reconciliation" to match transactions
   - Review matches and confidence scores

3. Export Report:
   - Click "Export PDF Report" to save results

4. Supported Formats:
   - CSV files with date, amount, and description columns
   - Common date formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY

For more help, visit: reconcilebook.com
        """
        messagebox.showinfo("Help", help_text)
    
    def run(self):
        """Start the application"""
        self.root.mainloop() 