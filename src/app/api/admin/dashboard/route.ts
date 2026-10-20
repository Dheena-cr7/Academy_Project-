import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
    const nowIso = new Date().toISOString();

    // 1. New Enquiries Today
    const newEnquiriesToday = db
      .prepare("SELECT COUNT(*) as count FROM contacts WHERE created_at LIKE ? AND is_archived = 0")
      .get(`${today}%`) as { count: number };

    // 2. Call Attempts Today (Manual or Telephony Outgoing)
    const callAttemptsToday = db
      .prepare(`
        SELECT COUNT(*) as count FROM call_logs 
        WHERE created_at LIKE ? 
        AND source IN ('manual_entry', 'telephony_webhook')
        AND provenance != 'website_click_intent'
      `)
      .get(`${today}%`) as { count: number };

    // 3. Confirmed Connected Calls Today
    const connectedCallsToday = db
      .prepare(`
        SELECT COUNT(*) as count FROM call_logs 
        WHERE created_at LIKE ? 
        AND outcome = 'connected'
      `)
      .get(`${today}%`) as { count: number };

    // 4. Provider-Confirmed Missed Calls Today
    const missedCallsToday = db
      .prepare(`
        SELECT COUNT(*) as count FROM call_logs 
        WHERE created_at LIKE ? 
        AND outcome IN ('no_answer', 'busy')
        AND provenance = 'provider_verified'
      `)
      .get(`${today}%`) as { count: number };

    // 5. Website Click-to-Call Intents Today
    const websiteCallIntentsToday = db
      .prepare(`
        SELECT COUNT(*) as count FROM call_logs 
        WHERE created_at LIKE ? 
        AND provenance = 'website_click_intent'
      `)
      .get(`${today}%`) as { count: number };

    // 6. Follow-ups Due Today
    const followUpsDueToday = db
      .prepare(`
        SELECT COUNT(*) as count FROM follow_ups 
        WHERE due_at LIKE ? AND status = 'pending'
      `)
      .get(`${today}%`) as { count: number };

    // 7. Overdue Follow-ups
    const overdueFollowUps = db
      .prepare(`
        SELECT COUNT(*) as count FROM follow_ups 
        WHERE due_at < ? AND status = 'pending'
      `)
      .get(nowIso) as { count: number };

    // 8. Open Enquiries by Status
    const statusCounts = db
      .prepare(`
        SELECT status, COUNT(*) as count 
        FROM contacts 
        WHERE is_archived = 0 
        GROUP BY status
      `)
      .all() as { status: string; count: number }[];

    // 9. Recent CRM Activities (Audit logs + Calls)
    const recentCalls = db
      .prepare(`
        SELECT 
          cl.id, cl.started_at, cl.direction, cl.outcome, cl.source, cl.provenance, cl.notes,
          c.parent_name, c.primary_phone, c.course_interest
        FROM call_logs cl
        LEFT JOIN contacts c ON cl.contact_id = c.id
        ORDER BY cl.created_at DESC
        LIMIT 6
      `)
      .all();

    const recentEnquiries = db
      .prepare(`
        SELECT id, parent_name, student_name, primary_phone, course_interest, status, created_at
        FROM contacts
        WHERE is_archived = 0
        ORDER BY created_at DESC
        LIMIT 6
      `)
      .all();

    return NextResponse.json({
      success: true,
      metrics: {
        newEnquiriesToday: newEnquiriesToday.count,
        callAttemptsToday: callAttemptsToday.count,
        connectedCallsToday: connectedCallsToday.count,
        missedCallsToday: missedCallsToday.count,
        websiteCallIntentsToday: websiteCallIntentsToday.count,
        followUpsDueToday: followUpsDueToday.count,
        overdueFollowUps: overdueFollowUps.count,
        statusCounts,
      },
      recentCalls,
      recentEnquiries,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to aggregate dashboard metrics' }, { status: 500 });
  }
}
