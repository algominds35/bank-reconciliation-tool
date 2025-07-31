"""
File upload widget with drag-and-drop support
"""

import customtkinter as ctk
from tkinter import filedialog
from pathlib import Path
import os

class FileUploadFrame(ctk.CTkFrame):
    """File upload widget with drag-and-drop support"""
    
    def __init__(self, parent, on_bank_file_selected=None, on_quickbooks_file_selected=None):
        super().__init__(parent)
        
        self.on_bank_file_selected = on_bank_file_selected
        self.on_quickbooks_file_selected = on_quickbooks_file_selected
        
        self.bank_file_path = None
        self.quickbooks_file_path = None
        
        self.setup_ui()
    
    def setup_ui(self):
        """Setup the file upload interface"""
        # Configure grid
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        
        # Title
        title_label = ctk.CTkLabel(
            self, 
            text="Import Files", 
            font=ctk.CTkFont(size=18, weight="bold")
        )
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Bank file section
        bank_frame = ctk.CTkFrame(self)
        bank_frame.grid(row=1, column=0, sticky="nsew", padx=(0, 10), pady=10)
        bank_frame.grid_columnconfigure(0, weight=1)
        
        bank_label = ctk.CTkLabel(
            bank_frame, 
            text="Bank Transactions", 
            font=ctk.CTkFont(size=14, weight="bold")
        )
        bank_label.grid(row=0, column=0, pady=(10, 5))
        
        self.bank_file_label = ctk.CTkLabel(
            bank_frame, 
            text="No file selected", 
            font=ctk.CTkFont(size=12),
            text_color="gray"
        )
        self.bank_file_label.grid(row=1, column=0, pady=(0, 10))
        
        self.bank_button = ctk.CTkButton(
            bank_frame,
            text="Select Bank File",
            command=self.select_bank_file,
            width=150
        )
        self.bank_button.grid(row=2, column=0, pady=(0, 10))
        
        self.bank_status_label = ctk.CTkLabel(
            bank_frame,
            text="",
            font=ctk.CTkFont(size=10),
            text_color="gray"
        )
        self.bank_status_label.grid(row=3, column=0, pady=(0, 10))
        
        # QuickBooks file section
        qb_frame = ctk.CTkFrame(self)
        qb_frame.grid(row=1, column=1, sticky="nsew", padx=(10, 0), pady=10)
        qb_frame.grid_columnconfigure(0, weight=1)
        
        qb_label = ctk.CTkLabel(
            qb_frame, 
            text="QuickBooks Transactions", 
            font=ctk.CTkFont(size=14, weight="bold")
        )
        qb_label.grid(row=0, column=0, pady=(10, 5))
        
        self.qb_file_label = ctk.CTkLabel(
            qb_frame, 
            text="No file selected", 
            font=ctk.CTkFont(size=12),
            text_color="gray"
        )
        self.qb_file_label.grid(row=1, column=0, pady=(0, 10))
        
        self.qb_button = ctk.CTkButton(
            qb_frame,
            text="Select QuickBooks File",
            command=self.select_quickbooks_file,
            width=150
        )
        self.qb_button.grid(row=2, column=0, pady=(0, 10))
        
        self.qb_status_label = ctk.CTkLabel(
            qb_frame,
            text="",
            font=ctk.CTkFont(size=10),
            text_color="gray"
        )
        self.qb_status_label.grid(row=3, column=0, pady=(0, 10))
        
        # Instructions
        instructions = """
Drag and drop CSV files here, or click the buttons above to select files.

Supported formats:
• Bank CSV exports (date, amount, description)
• QuickBooks CSV exports
• Common date formats: YYYY-MM-DD, MM/DD/YYYY
        """
        
        instructions_label = ctk.CTkLabel(
            self,
            text=instructions,
            font=ctk.CTkFont(size=11),
            text_color="gray",
            justify="left"
        )
        instructions_label.grid(row=2, column=0, columnspan=2, pady=20)
    
    def select_bank_file(self):
        """Select bank file via file dialog"""
        file_path = filedialog.askopenfilename(
            title="Select Bank CSV File",
            filetypes=[
                ("CSV files", "*.csv"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            self.bank_file_path = file_path
            self.bank_file_label.configure(
                text=Path(file_path).name,
                text_color="white"
            )
            self.bank_status_label.configure(text="File selected")
            
            if self.on_bank_file_selected:
                self.on_bank_file_selected(file_path)
    
    def select_quickbooks_file(self):
        """Select QuickBooks file via file dialog"""
        file_path = filedialog.askopenfilename(
            title="Select QuickBooks CSV File",
            filetypes=[
                ("CSV files", "*.csv"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            self.quickbooks_file_path = file_path
            self.qb_file_label.configure(
                text=Path(file_path).name,
                text_color="white"
            )
            self.qb_status_label.configure(text="File selected")
            
            if self.on_quickbooks_file_selected:
                self.on_quickbooks_file_selected(file_path)
    
    def update_file_status(self, file_type: str, success: bool):
        """Update file status display"""
        if file_type == "bank":
            if success:
                self.bank_status_label.configure(
                    text="✓ File processed successfully",
                    text_color="green"
                )
            else:
                self.bank_status_label.configure(
                    text="✗ Processing failed",
                    text_color="red"
                )
        elif file_type == "quickbooks":
            if success:
                self.qb_status_label.configure(
                    text="✓ File processed successfully",
                    text_color="green"
                )
            else:
                self.qb_status_label.configure(
                    text="✗ Processing failed",
                    text_color="red"
                )
    
    def clear_files(self):
        """Clear all file selections"""
        self.bank_file_path = None
        self.quickbooks_file_path = None
        
        self.bank_file_label.configure(
            text="No file selected",
            text_color="gray"
        )
        self.qb_file_label.configure(
            text="No file selected",
            text_color="gray"
        )
        
        self.bank_status_label.configure(text="")
        self.qb_status_label.configure(text="")
    
    def get_file_info(self, file_path: str) -> dict:
        """Get basic file information"""
        if not file_path or not os.path.exists(file_path):
            return {}
        
        path = Path(file_path)
        stat = path.stat()
        
        return {
            "name": path.name,
            "size": stat.st_size,
            "modified": stat.st_mtime,
            "exists": True
        } 