"""
CSV processing and data cleaning for reconciliation
"""

import pandas as pd
import csv
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
from decimal import Decimal
import logging

from .models import Transaction

logger = logging.getLogger(__name__)

class CSVProcessor:
    """Handles CSV file processing and data cleaning"""
    
    def __init__(self):
        self.supported_date_formats = [
            "%Y-%m-%d",
            "%m/%d/%Y", 
            "%d/%m/%Y",
            "%Y/%m/%d",
            "%m-%d-%Y",
            "%d-%m-%Y"
        ]
    
    def detect_csv_format(self, file_path: str) -> Dict[str, Any]:
        """Detect the format of a CSV file"""
        try:
            df = pd.read_csv(file_path, nrows=5)
            columns = df.columns.tolist()
            
            # Common column mappings
            date_columns = [col for col in columns if 'date' in col.lower()]
            amount_columns = [col for col in columns if 'amount' in col.lower() or 'amt' in col.lower()]
            desc_columns = [col for col in columns if 'desc' in col.lower() or 'memo' in col.lower() or 'note' in col.lower()]
            
            return {
                "date_column": date_columns[0] if date_columns else None,
                "amount_column": amount_columns[0] if amount_columns else None,
                "description_column": desc_columns[0] if desc_columns else None,
                "columns": columns,
                "sample_data": df.head().to_dict('records')
            }
        except Exception as e:
            logger.error(f"Error detecting CSV format: {e}")
            return {}
    
    def parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse date string with multiple format support"""
        if not date_str or pd.isna(date_str):
            return None
            
        date_str = str(date_str).strip()
        
        for fmt in self.supported_date_formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        logger.warning(f"Could not parse date: {date_str}")
        return None
    
    def parse_amount(self, amount_str: str) -> Optional[Decimal]:
        """Parse amount string to Decimal"""
        if not amount_str or pd.isna(amount_str):
            return None
            
        amount_str = str(amount_str).strip()
        
        # Remove currency symbols and commas
        amount_str = amount_str.replace('$', '').replace(',', '')
        
        try:
            return Decimal(amount_str)
        except (ValueError, TypeError):
            logger.warning(f"Could not parse amount: {amount_str}")
            return None
    
    def clean_description(self, desc: str) -> str:
        """Clean and normalize transaction description"""
        if not desc or pd.isna(desc):
            return ""
            
        desc = str(desc).strip()
        
        # Remove extra whitespace
        desc = ' '.join(desc.split())
        
        # Convert to lowercase for better matching
        return desc.lower()
    
    def process_csv(self, file_path: str, source: str = "unknown") -> List[Transaction]:
        """Process a CSV file and return list of transactions"""
        transactions = []
        
        try:
            # Detect format
            format_info = self.detect_csv_format(file_path)
            if not format_info:
                raise ValueError("Could not detect CSV format")
            
            # Read CSV
            df = pd.read_csv(file_path)
            
            # Get column mappings
            date_col = format_info["date_column"]
            amount_col = format_info["amount_column"] 
            desc_col = format_info["description_column"]
            
            if not all([date_col, amount_col, desc_col]):
                raise ValueError("Missing required columns (date, amount, description)")
            
            # Process each row
            for idx, row in df.iterrows():
                try:
                    # Parse date
                    date = self.parse_date(row[date_col])
                    if not date:
                        continue
                    
                    # Parse amount
                    amount = self.parse_amount(row[amount_col])
                    if amount is None:
                        continue
                    
                    # Clean description
                    description = self.clean_description(row[desc_col])
                    if not description:
                        continue
                    
                    # Create transaction
                    transaction = Transaction(
                        id=f"{source}_{idx}",
                        date=date,
                        description=description,
                        amount=amount,
                        source=source,
                        reference=str(row.get('reference', '')) if 'reference' in row else None
                    )
                    
                    transactions.append(transaction)
                    
                except Exception as e:
                    logger.warning(f"Error processing row {idx}: {e}")
                    continue
            
            logger.info(f"Processed {len(transactions)} transactions from {file_path}")
            return transactions
            
        except Exception as e:
            logger.error(f"Error processing CSV file {file_path}: {e}")
            raise
    
    def validate_transactions(self, transactions: List[Transaction]) -> Dict[str, Any]:
        """Validate processed transactions and return statistics"""
        if not transactions:
            return {"valid": False, "error": "No transactions found"}
        
        stats = {
            "total": len(transactions),
            "valid": True,
            "date_range": {
                "earliest": min(t.date for t in transactions),
                "latest": max(t.date for t in transactions)
            },
            "amount_stats": {
                "total": sum(t.amount for t in transactions),
                "average": sum(t.amount for t in transactions) / len(transactions),
                "min": min(t.amount for t in transactions),
                "max": max(t.amount for t in transactions)
            },
            "source_distribution": {}
        }
        
        # Count by source
        for transaction in transactions:
            source = transaction.source
            stats["source_distribution"][source] = stats["source_distribution"].get(source, 0) + 1
        
        return stats 