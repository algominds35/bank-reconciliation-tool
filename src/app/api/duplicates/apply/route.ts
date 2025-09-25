import { NextRequest, NextResponse } from 'next/server';
import { dedupeApply, exportCleanData, exportAuditLog } from '@/lib/duplicateDetection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { groups, keepMap, userId } = body;

    if (!groups || !Array.isArray(groups)) {
      return NextResponse.json(
        { error: 'Invalid groups data' },
        { status: 400 }
      );
    }

    if (!keepMap || typeof keepMap !== 'object') {
      return NextResponse.json(
        { error: 'Invalid keepMap data' },
        { status: 400 }
      );
    }

    // Apply deduplication
    const auditLog = dedupeApply(groups, keepMap, userId);

    // Generate export data
    const cleanDataExport = exportCleanData([], auditLog, 'csv'); // Empty array since we're just getting the structure
    const auditExport = exportAuditLog(auditLog, 'json');

    return NextResponse.json({
      success: true,
      auditLog,
      exports: {
        cleanData: {
          format: 'csv',
          filename: cleanDataExport.filename
        },
        auditLog: {
          format: 'json',
          filename: auditExport.filename
        }
      },
      summary: auditLog.summary
    });

  } catch (error) {
    console.error('Error applying deduplication:', error);
    return NextResponse.json(
      { error: 'Failed to apply deduplication' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get('auditId');
    const format = searchParams.get('format') || 'json';

    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would fetch the audit log from your database
    // For now, we'll return a mock response
    const mockAuditLog = {
      id: auditId,
      timestamp: new Date().toISOString(),
      actions: [],
      summary: {
        total_processed: 0,
        definite_duplicates: 0,
        possible_duplicates: 0,
        removed_count: 0
      }
    };

    const exportData = exportAuditLog(mockAuditLog, format as 'csv' | 'json');

    return NextResponse.json({
      success: true,
      auditLog: mockAuditLog,
      exportData
    });

  } catch (error) {
    console.error('Error fetching audit log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit log' },
      { status: 500 }
    );
  }
}
