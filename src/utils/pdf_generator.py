"""
PDF report generator for reconciliation results
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
from decimal import Decimal
from typing import List

from ..core.models import ReconciliationResult, Match

class PDFGenerator:
    """Generates PDF reports for reconciliation results"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom paragraph styles"""
        self.styles.add(ParagraphStyle(
            name='Title',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=20,
            alignment=TA_CENTER
        ))
        
        self.styles.add(ParagraphStyle(
            name='Subtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12
        ))
        
        self.styles.add(ParagraphStyle(
            name='Body',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6
        ))
    
    def generate_report(self, result: ReconciliationResult, output_path: str):
        """Generate a complete PDF reconciliation report"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title page
        story.extend(self.create_title_page(result))
        story.append(Spacer(1, 20))
        
        # Summary page
        story.extend(self.create_summary_page(result))
        story.append(Spacer(1, 20))
        
        # Matches page
        story.extend(self.create_matches_page(result))
        story.append(Spacer(1, 20))
        
        # Unmatched transactions
        if result.unmatched_bank or result.unmatched_quickbooks:
            story.extend(self.create_unmatched_page(result))
            story.append(Spacer(1, 20))
        
        # Build PDF
        doc.build(story)
    
    def create_title_page(self, result: ReconciliationResult) -> List:
        """Create the title page"""
        elements = []
        
        # Title
        title = Paragraph("Reconciliation Report", self.styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 30))
        
        # Date
        date_text = f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        date_para = Paragraph(date_text, self.styles['Body'])
        elements.append(date_para)
        elements.append(Spacer(1, 20))
        
        # Summary stats
        stats = result.get_summary_stats()
        summary_data = [
            ["Total Bank Transactions", str(stats['total_bank_transactions'])],
            ["Total QuickBooks Transactions", str(stats['total_quickbooks_transactions'])],
            ["Total Matches", str(stats['total_matches'])],
            ["Perfect Matches", str(stats['perfect_matches'])],
            ["Unmatched Bank", str(stats['unmatched_bank'])],
            ["Unmatched QuickBooks", str(stats['unmatched_quickbooks'])],
            ["Average Confidence", f"{stats['average_confidence']*100:.1f}%"]
        ]
        
        summary_table = Table(summary_data, colWidths=[2*inch, 1*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(summary_table)
        
        return elements
    
    def create_summary_page(self, result: ReconciliationResult) -> List:
        """Create the summary page"""
        elements = []
        
        # Page title
        title = Paragraph("Reconciliation Summary", self.styles['Subtitle'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Date range
        if result.bank_transactions:
            dates = [tx.date for tx in result.bank_transactions]
            date_range = f"Date Range: {min(dates).strftime('%Y-%m-%d')} to {max(dates).strftime('%Y-%m-%d')}"
            date_para = Paragraph(date_range, self.styles['Body'])
            elements.append(date_para)
            elements.append(Spacer(1, 12))
        
        # Confidence distribution
        confidence_data = [
            ["Confidence Level", "Count", "Percentage"]
        ]
        
        perfect_matches = len([m for m in result.matches if m.confidence_score >= 0.95])
        high_matches = len([m for m in result.matches if 0.8 <= m.confidence_score < 0.95])
        medium_matches = len([m for m in result.matches if 0.7 <= m.confidence_score < 0.8])
        low_matches = len([m for m in result.matches if m.confidence_score < 0.7])
        
        total_matches = len(result.matches)
        
        if total_matches > 0:
            confidence_data.extend([
                ["Perfect (95%+)", str(perfect_matches), f"{perfect_matches/total_matches*100:.1f}%"],
                ["High (80-95%)", str(high_matches), f"{high_matches/total_matches*100:.1f}%"],
                ["Medium (70-80%)", str(medium_matches), f"{medium_matches/total_matches*100:.1f}%"],
                ["Low (<70%)", str(low_matches), f"{low_matches/total_matches*100:.1f}%"]
            ])
        
        confidence_table = Table(confidence_data, colWidths=[2*inch, 1*inch, 1*inch])
        confidence_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(confidence_table)
        
        return elements
    
    def create_matches_page(self, result: ReconciliationResult) -> List:
        """Create the matches page"""
        elements = []
        
        # Page title
        title = Paragraph("Matched Transactions", self.styles['Subtitle'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        if not result.matches:
            no_matches = Paragraph("No matches found.", self.styles['Body'])
            elements.append(no_matches)
            return elements
        
        # Create matches table
        matches_data = [
            ["Date", "Bank Description", "Bank Amount", "QB Amount", "Confidence", "Status"]
        ]
        
        # Sort matches by confidence (highest first)
        sorted_matches = sorted(result.matches, key=lambda x: x.confidence_score, reverse=True)
        
        for match in sorted_matches[:50]:  # Limit to top 50 matches
            confidence_pct = f"{match.confidence_score*100:.1f}%"
            
            if match.confidence_score >= 0.95:
                status = "Perfect"
            elif match.confidence_score >= 0.8:
                status = "High"
            elif match.confidence_score >= 0.7:
                status = "Medium"
            else:
                status = "Low"
            
            matches_data.append([
                match.bank_transaction.date.strftime("%Y-%m-%d"),
                match.bank_transaction.description[:40] + "..." if len(match.bank_transaction.description) > 40 else match.bank_transaction.description,
                f"${match.bank_transaction.amount:,.2f}",
                f"${match.quickbooks_transaction.amount:,.2f}",
                confidence_pct,
                status
            ])
        
        matches_table = Table(matches_data, colWidths=[0.8*inch, 2*inch, 0.8*inch, 0.8*inch, 0.8*inch, 0.8*inch])
        matches_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('FONTSIZE', (0, 1), (-1, -1), 7),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP')
        ]))
        
        elements.append(matches_table)
        
        if len(result.matches) > 50:
            note = Paragraph(f"Note: Showing top 50 matches out of {len(result.matches)} total matches.", self.styles['Body'])
            elements.append(Spacer(1, 6))
            elements.append(note)
        
        return elements
    
    def create_unmatched_page(self, result: ReconciliationResult) -> List:
        """Create the unmatched transactions page"""
        elements = []
        
        # Page title
        title = Paragraph("Unmatched Transactions", self.styles['Subtitle'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Unmatched bank transactions
        if result.unmatched_bank:
            bank_title = Paragraph("Unmatched Bank Transactions:", self.styles['Body'])
            elements.append(bank_title)
            elements.append(Spacer(1, 6))
            
            bank_data = [["Date", "Description", "Amount"]]
            for tx in result.unmatched_bank[:25]:  # Limit to 25
                bank_data.append([
                    tx.date.strftime("%Y-%m-%d"),
                    tx.description[:50] + "..." if len(tx.description) > 50 else tx.description,
                    f"${tx.amount:,.2f}"
                ])
            
            bank_table = Table(bank_data, colWidths=[1*inch, 3*inch, 1*inch])
            bank_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(bank_table)
            elements.append(Spacer(1, 12))
        
        # Unmatched QuickBooks transactions
        if result.unmatched_quickbooks:
            qb_title = Paragraph("Unmatched QuickBooks Transactions:", self.styles['Body'])
            elements.append(qb_title)
            elements.append(Spacer(1, 6))
            
            qb_data = [["Date", "Description", "Amount"]]
            for tx in result.unmatched_quickbooks[:25]:  # Limit to 25
                qb_data.append([
                    tx.date.strftime("%Y-%m-%d"),
                    tx.description[:50] + "..." if len(tx.description) > 50 else tx.description,
                    f"${tx.amount:,.2f}"
                ])
            
            qb_table = Table(qb_data, colWidths=[1*inch, 3*inch, 1*inch])
            qb_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(qb_table)
        
        return elements 