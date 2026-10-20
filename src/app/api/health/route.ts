import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = performance.now();

  try {
    const db = getDb();

    // Verify DB connectivity and query response time
    const testResult = db.prepare('SELECT 1 as test').get() as { test: number } | undefined;
    if (!testResult || testResult.test !== 1) {
      throw new Error('Database ping query failed');
    }

    // Collect high-level operational statistics
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as totalContacts,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as newEnquiries,
        SUM(CASE WHEN is_archived = 0 THEN 1 ELSE 0 END) as activeRecords
      FROM contacts
    `).get() as { totalContacts: number; newEnquiries: number; activeRecords: number };

    const latencyMs = Math.round((performance.now() - startTime) * 100) / 100;

    return NextResponse.json({
      status: 'healthy',
      institution: 'Kalaivani Sainik RIMC Coaching Centre',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: 'connected',
        driver: 'better-sqlite3',
        queryLatencyMs: latencyMs,
        stats: {
          totalContacts: stats?.totalContacts || 0,
          newEnquiries: stats?.newEnquiries || 0,
          activeRecords: stats?.activeRecords || 0,
        },
      },
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown database error';
    return NextResponse.json({
      status: 'unhealthy',
      error: errorMessage,
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
      },
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
