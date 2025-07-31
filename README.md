# ReconcileBook Desktop

A local-only bank reconciliation tool that matches bank transactions with QuickBooks data and generates professional PDF reports.

## Features

- **100% Local**: No internet connection required, all processing happens on your machine
- **Smart Matching**: Advanced algorithm with confidence scoring
- **Drag & Drop**: Easy file import with support for CSV files
- **Professional Reports**: Generate detailed PDF reconciliation reports
- **Modern UI**: Clean, intuitive interface built with CustomTkinter
- **Secure**: No data leaves your computer

## Installation

### Prerequisites
- Python 3.9 or higher
- Windows, macOS, or Linux

### Quick Start

1. **Clone or download this repository**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python src/main.py
   ```

## Usage

### 1. Import Files
- Click "Select Bank File" to load your bank CSV export
- Click "Select QuickBooks File" to load your QuickBooks CSV export
- Supported formats: CSV files with date, amount, and description columns

### 2. Run Reconciliation
- Click "Run Reconciliation" to match transactions
- Review matches and confidence scores in the transaction view
- Filter by confidence level and view type

### 3. Export Report
- Click "Export PDF Report" to save a professional reconciliation report
- Reports include summary statistics, matched transactions, and unmatched items

## Supported File Formats

### Bank CSV Files
Should contain columns for:
- **Date**: Transaction date (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY)
- **Amount**: Transaction amount (no currency symbols)
- **Description**: Transaction description

### QuickBooks CSV Files
Export from QuickBooks with:
- Transaction date
- Amount
- Description/Memo
- Account/Category (optional)

## Building Executable

To create a standalone executable:

```bash
python build.py
```

This creates `dist/ReconcileBook.exe` (Windows) or equivalent for your platform.

## Technical Details

### Architecture
- **Backend**: Python with Pandas for data processing
- **GUI**: CustomTkinter for modern interface
- **Matching**: Custom algorithm with confidence scoring
- **Reports**: ReportLab for PDF generation

### Matching Algorithm
The tool uses a multi-factor matching algorithm:
- **Description Similarity**: 40% weight
- **Date Proximity**: 30% weight  
- **Amount Matching**: 30% weight

Confidence scores range from 0.0 to 1.0:
- **Perfect (95%+)**: Exact or near-exact matches
- **High (80-95%)**: Very similar transactions
- **Medium (70-80%)**: Reasonable matches
- **Low (<70%)**: Potential matches requiring review

## Troubleshooting

### Common Issues

**"No file selected" error**
- Ensure your CSV files have the required columns (date, amount, description)
- Check that date formats are supported
- Verify amounts don't contain currency symbols

**Low match rates**
- Check that date ranges overlap between files
- Ensure descriptions are similar between bank and QuickBooks
- Verify amounts match exactly (including fees)

**Application won't start**
- Ensure Python 3.9+ is installed
- Install all dependencies: `pip install -r requirements.txt`
- Check that all files are in the correct directory structure

## Security

- **No Internet**: Application works completely offline
- **Local Processing**: All data stays on your machine
- **No Telemetry**: No data collection or tracking
- **Open Source**: Code is transparent and auditable

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the console output for error messages
- Ensure your CSV files follow the supported format

## License

This project is licensed under the MIT License.

---

**ReconcileBook Desktop** - Professional reconciliation made simple and secure. 