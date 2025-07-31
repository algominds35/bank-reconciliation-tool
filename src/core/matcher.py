"""
Transaction matching algorithm for reconciliation
"""

import logging
from typing import List, Tuple, Dict, Any
from decimal import Decimal
from difflib import SequenceMatcher
import re

from .models import Transaction, Match, ReconciliationResult

logger = logging.getLogger(__name__)

class TransactionMatcher:
    """Smart transaction matching algorithm"""
    
    def __init__(self, confidence_threshold: float = 0.7):
        self.confidence_threshold = confidence_threshold
        self.date_tolerance_days = 3
        self.amount_tolerance = Decimal('0.01')
    
    def calculate_similarity(self, str1: str, str2: str) -> float:
        """Calculate string similarity using SequenceMatcher"""
        if not str1 or not str2:
            return 0.0
        
        # Normalize strings
        str1 = str1.lower().strip()
        str2 = str2.lower().strip()
        
        # Remove common words that don't help matching
        common_words = {'the', 'and', 'or', 'of', 'for', 'with', 'by', 'in', 'on', 'at', 'to', 'from'}
        str1_words = [w for w in re.findall(r'\w+', str1) if w not in common_words]
        str2_words = [w for w in re.findall(r'\w+', str2) if w not in common_words]
        
        if not str1_words or not str2_words:
            return SequenceMatcher(None, str1, str2).ratio()
        
        # Calculate word-level similarity
        word_similarity = SequenceMatcher(None, ' '.join(str1_words), ' '.join(str2_words)).ratio()
        
        # Calculate character-level similarity
        char_similarity = SequenceMatcher(None, str1, str2).ratio()
        
        # Return weighted average
        return (word_similarity * 0.7) + (char_similarity * 0.3)
    
    def calculate_date_similarity(self, date1, date2) -> float:
        """Calculate date similarity based on proximity"""
        if not date1 or not date2:
            return 0.0
        
        days_diff = abs((date1 - date2).days)
        
        if days_diff == 0:
            return 1.0
        elif days_diff <= self.date_tolerance_days:
            return 1.0 - (days_diff / self.date_tolerance_days) * 0.3
        else:
            return 0.0
    
    def calculate_amount_similarity(self, amount1: Decimal, amount2: Decimal) -> float:
        """Calculate amount similarity"""
        if amount1 == amount2:
            return 1.0
        
        # Check if amounts are within tolerance
        if abs(amount1 - amount2) <= self.amount_tolerance:
            return 0.9
        
        # Check for fee differences (common in bank vs QuickBooks)
        if amount1 != 0 and amount2 != 0:
            ratio = min(amount1, amount2) / max(amount1, amount2)
            if ratio > 0.95:  # Within 5%
                return 0.8
        
        return 0.0
    
    def calculate_match_confidence(self, bank_tx: Transaction, qb_tx: Transaction) -> Tuple[float, str]:
        """Calculate overall match confidence and reason"""
        # Calculate individual similarities
        desc_similarity = self.calculate_similarity(bank_tx.description, qb_tx.description)
        date_similarity = self.calculate_date_similarity(bank_tx.date, qb_tx.date)
        amount_similarity = self.calculate_amount_similarity(bank_tx.amount, qb_tx.amount)
        
        # Weight the similarities
        weights = {
            'description': 0.4,
            'date': 0.3,
            'amount': 0.3
        }
        
        overall_confidence = (
            desc_similarity * weights['description'] +
            date_similarity * weights['date'] +
            amount_similarity * weights['amount']
        )
        
        # Generate match reason
        reasons = []
        if desc_similarity > 0.8:
            reasons.append("exact description")
        elif desc_similarity > 0.6:
            reasons.append("similar description")
        
        if date_similarity > 0.9:
            reasons.append("exact date")
        elif date_similarity > 0.7:
            reasons.append("close date")
        
        if amount_similarity > 0.9:
            reasons.append("exact amount")
        elif amount_similarity > 0.8:
            reasons.append("similar amount")
        
        reason = " + ".join(reasons) if reasons else "partial match"
        
        return overall_confidence, reason
    
    def find_matches(self, bank_transactions: List[Transaction], 
                    quickbooks_transactions: List[Transaction]) -> ReconciliationResult:
        """Find matches between bank and QuickBooks transactions"""
        
        matches = []
        matched_bank_ids = set()
        matched_qb_ids = set()
        
        # Sort transactions by date for better matching
        bank_sorted = sorted(bank_transactions, key=lambda x: x.date)
        qb_sorted = sorted(quickbooks_transactions, key=lambda x: x.date)
        
        # Find potential matches
        for bank_tx in bank_sorted:
            if bank_tx.id in matched_bank_ids:
                continue
                
            best_match = None
            best_confidence = 0.0
            best_reason = ""
            
            for qb_tx in qb_sorted:
                if qb_tx.id in matched_qb_ids:
                    continue
                
                confidence, reason = self.calculate_match_confidence(bank_tx, qb_tx)
                
                if confidence > best_confidence and confidence >= self.confidence_threshold:
                    best_confidence = confidence
                    best_match = qb_tx
                    best_reason = reason
            
            # Create match if we found a good one
            if best_match:
                match = Match(
                    bank_transaction=bank_tx,
                    quickbooks_transaction=best_match,
                    confidence_score=best_confidence,
                    match_reason=best_reason
                )
                matches.append(match)
                matched_bank_ids.add(bank_tx.id)
                matched_qb_ids.add(best_match.id)
        
        # Find unmatched transactions
        unmatched_bank = [tx for tx in bank_transactions if tx.id not in matched_bank_ids]
        unmatched_qb = [tx for tx in quickbooks_transactions if tx.id not in matched_qb_ids]
        
        return ReconciliationResult(
            bank_transactions=bank_transactions,
            quickbooks_transactions=quickbooks_transactions,
            matches=matches,
            unmatched_bank=unmatched_bank,
            unmatched_quickbooks=unmatched_qb,
            total_matched=len(matches),
            total_unmatched=len(unmatched_bank) + len(unmatched_qb),
            confidence_threshold=self.confidence_threshold
        )
    
    def suggest_matches(self, bank_tx: Transaction, 
                       quickbooks_transactions: List[Transaction], 
                       limit: int = 5) -> List[Tuple[Transaction, float, str]]:
        """Suggest potential matches for a single transaction"""
        suggestions = []
        
        for qb_tx in quickbooks_transactions:
            confidence, reason = self.calculate_match_confidence(bank_tx, qb_tx)
            if confidence > 0.3:  # Lower threshold for suggestions
                suggestions.append((qb_tx, confidence, reason))
        
        # Sort by confidence and return top matches
        suggestions.sort(key=lambda x: x[1], reverse=True)
        return suggestions[:limit]
    
    def get_matching_stats(self, result: ReconciliationResult) -> Dict[str, Any]:
        """Get detailed matching statistics"""
        stats = result.get_summary_stats()
        
        # Add confidence distribution
        confidence_ranges = {
            "Perfect (95%+)": len([m for m in result.matches if m.confidence_score >= 0.95]),
            "High (80-95%)": len([m for m in result.matches if 0.8 <= m.confidence_score < 0.95]),
            "Medium (70-80%)": len([m for m in result.matches if 0.7 <= m.confidence_score < 0.8]),
            "Low (<70%)": len([m for m in result.matches if m.confidence_score < 0.7])
        }
        
        stats["confidence_distribution"] = confidence_ranges
        
        return stats 