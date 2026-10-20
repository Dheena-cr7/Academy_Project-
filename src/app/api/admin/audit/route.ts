import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canViewAuditLogs(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden. Super Admin or Auditor role required.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const action = searchParams.get('action');

  try {
    const db = getDb();
    let sql = 'SELECT * FROM audit_logs WHERE 1=1';
    const params: unknown[] = [];

    if (action) {
      sql += ' AND action = ?';
      params.push(action);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const logs = db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, logs });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve audit logs' }, { status: 500 });
  }
}
