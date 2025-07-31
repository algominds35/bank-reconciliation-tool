"""
Transaction view widget for displaying reconciliation results
"""

import customtkinter as ctk
from tkinter import ttk
from typing import List, Optional
import pandas as pd

from ..core.models import ReconciliationResult, Match

class TransactionViewFrame(ctk.CTkFrame):
    """Widget for displaying transaction reconciliation results"""
    
    def __init__(self, parent):
        super().__init__(parent)
        
        self.reconciliation_result = None
        self.current_view = "matches"  # matches, unmatched_bank, unmatched_qb
        
        self.setup_ui()
    
    def setup_ui(self):
        """Setup the transaction view interface"""
        # Configure grid
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        # Header with controls
        header_frame = ctk.CTkFrame(self)
        header_frame.grid(row=0, column=0, sticky="ew", padx=10, pady=10)
        header_frame.grid_columnconfigure(1, weight=1)
        
        # View selector
        view_label = ctk.CTkLabel(header_frame, text="View:")
        view_label.grid(row=0, column=0, padx=(10, 5), pady=10)
        
        self.view_var = ctk.StringVar(value="matches")
        view_combo = ctk.CTkComboBox(
            header_frame,
            values=["Matches", "Unmatched Bank", "Unmatched QuickBooks"],
            variable=self.view_var,
            command=self.on_view_changed
        )
        view_combo.grid(row=0, column=1, padx=5, pady=10, sticky="w")
        
        # Confidence filter
        confidence_label = ctk.CTkLabel(header_frame, text="Min Confidence:")
        confidence_label.grid(row=0, column=2, padx=(20, 5), pady=10)
        
        self.confidence_var = ctk.StringVar(value="0.7")
        confidence_combo = ctk.CTkComboBox(
            header_frame,
            values=["0.5", "0.6", "0.7", "0.8", "0.9"],
            variable=self.confidence_var,
            command=self.on_confidence_changed
        )
        confidence_combo.grid(row=0, column=3, padx=5, pady=10)
        
        # Stats display
        self.stats_label = ctk.CTkLabel(
            header_frame,
            text="No data loaded",
            font=ctk.CTkFont(size=12)
        )
        self.stats_label.grid(row=0, column=4, padx=20, pady=10, sticky="e")
        
        # Transaction list
        list_frame = ctk.CTkFrame(self)
        list_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=(0, 10))
        list_frame.grid_columnconfigure(0, weight=1)
        list_frame.grid_rowconfigure(0, weight=1)
        
        # Create treeview for transactions
        columns = ("Date", "Description", "Amount", "Confidence", "Status")
        self.tree = ttk.Treeview(list_frame, columns=columns, show="headings", height=15)
        
        # Configure columns
        self.tree.heading("Date", text="Date")
        self.tree.heading("Description", text="Description")
        self.tree.heading("Amount", text="Amount")
        self.tree.heading("Confidence", text="Confidence")
        self.tree.heading("Status", text="Status")
        
        self.tree.column("Date", width=100)
        self.tree.column("Description", width=300)
        self.tree.column("Amount", width=100)
        self.tree.column("Confidence", width=100)
        self.tree.column("Status", width=100)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        # Grid treeview and scrollbar
        self.tree.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)
        scrollbar.grid(row=0, column=1, sticky="ns", pady=10)
        
        # Bind double-click for details
        self.tree.bind("<Double-1>", self.on_item_double_click)
    
    def update_data(self, result: ReconciliationResult):
        """Update the view with new reconciliation data"""
        self.reconciliation_result = result
        self.refresh_view()
    
    def refresh_view(self):
        """Refresh the current view"""
        if not self.reconciliation_result:
            self.clear_data()
            return
        
        # Clear existing items
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        # Get current view and confidence threshold
        view = self.view_var.get()
        min_confidence = float(self.confidence_var.get())
        
        if view == "Matches":
            self.display_matches(min_confidence)
        elif view == "Unmatched Bank":
            self.display_unmatched_bank()
        elif view == "Unmatched QuickBooks":
            self.display_unmatched_quickbooks()
        
        # Update stats
        self.update_stats()
    
    def display_matches(self, min_confidence: float):
        """Display matched transactions"""
        if not self.reconciliation_result:
            return
        
        matches = [m for m in self.reconciliation_result.matches if m.confidence_score >= min_confidence]
        
        for match in matches:
            # Format confidence as percentage
            confidence_pct = f"{match.confidence_score * 100:.1f}%"
            
            # Determine status color
            if match.confidence_score >= 0.95:
                status = "Perfect"
                tags = ("perfect",)
            elif match.confidence_score >= 0.8:
                status = "High"
                tags = ("high",)
            elif match.confidence_score >= 0.7:
                status = "Medium"
                tags = ("medium",)
            else:
                status = "Low"
                tags = ("low",)
            
            # Insert into treeview
            item = self.tree.insert(
                "",
                "end",
                values=(
                    match.bank_transaction.date.strftime("%Y-%m-%d"),
                    match.bank_transaction.description[:50] + "..." if len(match.bank_transaction.description) > 50 else match.bank_transaction.description,
                    f"${match.bank_transaction.amount:,.2f}",
                    confidence_pct,
                    status
                ),
                tags=tags
            )
            
            # Store match data for double-click
            self.tree.set(item, "match_data", match)
    
    def display_unmatched_bank(self):
        """Display unmatched bank transactions"""
        if not self.reconciliation_result:
            return
        
        for tx in self.reconciliation_result.unmatched_bank:
            self.tree.insert(
                "",
                "end",
                values=(
                    tx.date.strftime("%Y-%m-%d"),
                    tx.description[:50] + "..." if len(tx.description) > 50 else tx.description,
                    f"${tx.amount:,.2f}",
                    "",
                    "Unmatched"
                ),
                tags=("unmatched",)
            )
    
    def display_unmatched_quickbooks(self):
        """Display unmatched QuickBooks transactions"""
        if not self.reconciliation_result:
            return
        
        for tx in self.reconciliation_result.unmatched_quickbooks:
            self.tree.insert(
                "",
                "end",
                values=(
                    tx.date.strftime("%Y-%m-%d"),
                    tx.description[:50] + "..." if len(tx.description) > 50 else tx.description,
                    f"${tx.amount:,.2f}",
                    "",
                    "Unmatched"
                ),
                tags=("unmatched",)
            )
    
    def update_stats(self):
        """Update statistics display"""
        if not self.reconciliation_result:
            self.stats_label.configure(text="No data loaded")
            return
        
        stats = self.reconciliation_result.get_summary_stats()
        view = self.view_var.get()
        
        if view == "Matches":
            min_confidence = float(self.confidence_var.get())
            matches = [m for m in self.reconciliation_result.matches if m.confidence_score >= min_confidence]
            count = len(matches)
            self.stats_label.configure(text=f"Showing {count} matches (≥{min_confidence*100:.0f}% confidence)")
        elif view == "Unmatched Bank":
            count = len(self.reconciliation_result.unmatched_bank)
            self.stats_label.configure(text=f"Showing {count} unmatched bank transactions")
        elif view == "Unmatched QuickBooks":
            count = len(self.reconciliation_result.unmatched_quickbooks)
            self.stats_label.configure(text=f"Showing {count} unmatched QuickBooks transactions")
    
    def on_view_changed(self, value):
        """Handle view selection change"""
        self.refresh_view()
    
    def on_confidence_changed(self, value):
        """Handle confidence threshold change"""
        if self.view_var.get() == "Matches":
            self.refresh_view()
    
    def on_item_double_click(self, event):
        """Handle double-click on transaction item"""
        selection = self.tree.selection()
        if not selection:
            return
        
        item = selection[0]
        values = self.tree.item(item, "values")
        
        if self.view_var.get() == "Matches":
            # Show match details
            self.show_match_details(item)
        else:
            # Show transaction details
            self.show_transaction_details(values)
    
    def show_match_details(self, item):
        """Show detailed information about a match"""
        match_data = self.tree.item(item, "values")
        
        # Get the actual match object
        match = None
        for m in self.reconciliation_result.matches:
            if (m.bank_transaction.date.strftime("%Y-%m-%d") == match_data[0] and
                m.bank_transaction.description[:50] == match_data[1][:50] and
                f"${m.bank_transaction.amount:,.2f}" == match_data[2]):
                match = m
                break
        
        if not match:
            return
        
        details = f"""
Match Details:

Bank Transaction:
  Date: {match.bank_transaction.date.strftime('%Y-%m-%d')}
  Description: {match.bank_transaction.description}
  Amount: ${match.bank_transaction.amount:,.2f}

QuickBooks Transaction:
  Date: {match.quickbooks_transaction.date.strftime('%Y-%m-%d')}
  Description: {match.quickbooks_transaction.description}
  Amount: ${match.quickbooks_transaction.amount:,.2f}

Match Information:
  Confidence: {match.confidence_score * 100:.1f}%
  Reason: {match.match_reason}
  Amount Difference: ${match.amount_difference:,.2f}
        """
        
        # Create detail window
        detail_window = ctk.CTkToplevel()
        detail_window.title("Match Details")
        detail_window.geometry("500x400")
        
        text_widget = ctk.CTkTextbox(detail_window)
        text_widget.pack(fill="both", expand=True, padx=10, pady=10)
        text_widget.insert("1.0", details)
        text_widget.configure(state="disabled")
    
    def show_transaction_details(self, values):
        """Show detailed information about a transaction"""
        details = f"""
Transaction Details:

Date: {values[0]}
Description: {values[1]}
Amount: {values[2]}
Status: {values[4]}
        """
        
        # Create detail window
        detail_window = ctk.CTkToplevel()
        detail_window.title("Transaction Details")
        detail_window.geometry("400x300")
        
        text_widget = ctk.CTkTextbox(detail_window)
        text_widget.pack(fill="both", expand=True, padx=10, pady=10)
        text_widget.insert("1.0", details)
        text_widget.configure(state="disabled")
    
    def clear_data(self):
        """Clear all displayed data"""
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        self.stats_label.configure(text="No data loaded")
        self.reconciliation_result = None 