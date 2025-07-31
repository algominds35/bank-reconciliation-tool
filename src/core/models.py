"""
Data models for the reconciliation tool
"""

from dataclasses import dataclass
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal

@dataclass
class Transaction:
    """Represents a single transaction"""
    id: str
    date: datetime
    description: str
    amount: Decimal
    category: Optional[str] = None
    account: Optional[str] = None
    reference: Optional[str] = None
    source: str = "unknown"  # "bank" or "quickbooks"
    
    def __post_init__(self):
        if isinstance(self.amount, (int, float)):
            self.amount = Decimal(str(self.amount))
        if isinstance(self.date, str):
            # Handle various date formats
            try:
                self.date = datetime.strptime(self.date, "%Y-%m-%d")
            except ValueError:
                try:
                    self.date = datetime.strptime(self.date, "%m/%d/%Y")
                except ValueError:
                    self.date = datetime.strptime(self.date, "%d/%m/%Y")

@dataclass
class Match:
    """Represents a matched pair of transactions"""
    bank_transaction: Transaction
    quickbooks_transaction: Transaction
    confidence_score: float
    match_reason: str
    
    @property
    def is_perfect_match(self) -> bool:
        """Check if this is a perfect match (100% confidence)"""
        return self.confidence_score >= 0.95
    
    @property
    def amount_difference(self) -> Decimal:
        """Calculate the difference between amounts"""
        return abs(self.bank_transaction.amount - self.quickbooks_transaction.amount)

@dataclass
class ReconciliationResult:
    """Results of the reconciliation process"""
    bank_transactions: List[Transaction]
    quickbooks_transactions: List[Transaction]
    matches: List[Match]
    unmatched_bank: List[Transaction]
    unmatched_quickbooks: List[Transaction]
    total_matched: int
    total_unmatched: int
    confidence_threshold: float = 0.7
    
    def get_matches_by_confidence(self, min_confidence: float = None) -> List[Match]:
        """Get matches above a certain confidence threshold"""
        threshold = min_confidence or self.confidence_threshold
        return [match for match in self.matches if match.confidence_score >= threshold]
    
    def get_perfect_matches(self) -> List[Match]:
        """Get only perfect matches (95%+ confidence)"""
        return [match for match in self.matches if match.is_perfect_match]
    
    def get_summary_stats(self) -> Dict[str, Any]:
        """Get summary statistics"""
        return {
            "total_bank_transactions": len(self.bank_transactions),
            "total_quickbooks_transactions": len(self.quickbooks_transactions),
            "total_matches": len(self.matches),
            "perfect_matches": len(self.get_perfect_matches()),
            "unmatched_bank": len(self.unmatched_bank),
            "unmatched_quickbooks": len(self.unmatched_quickbooks),
            "average_confidence": sum(m.confidence_score for m in self.matches) / len(self.matches) if self.matches else 0
        } 