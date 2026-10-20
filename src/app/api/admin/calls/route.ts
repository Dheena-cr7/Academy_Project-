import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { generateId, normalizeIndianPhoneNumber } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source'); // 'manual_entry' | 'website_click' | 'telephony_webhook'
  const provenance = searchParams.get('provenance');
  const outcome = searchParams.get('outcome');
  const contactId = searchParams.get('contactId');
  const limit = parseInt(searchParams.get('limit') || '100', 10);

  try {
    const db = getDb();
    let sql = `
      SELECT 
        cl.*,
        c.parent_name,
        c.student_name,
        c.primary_phone,
        c.course_interest,
        u.full_name as staff_name
      FROM call_logs cl
      LEFT JOIN contacts c ON cl.contact_id = c.id
      LEFT JOIN users u ON cl.staff_id = u.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (source) {
      sql += ` AND cl.source = ?`;
      params.push(source);
    }
    if (provenance) {
      sql += ` AND cl.provenance = ?`;
      params.push(provenance);
    }
    if (outcome) {
      sql += ` AND cl.outcome = ?`;
      params.push(outcome);
    }
    if (contactId) {
      sql += ` AND cl.contact_id = ?`;
      params.push(contactId);
    }

    sql += ` ORDER BY cl.created_at DESC LIMIT ?`;
    params.push(limit);

    const calls = db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, calls });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve call logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canLogCalls(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      contactId,
      newContactPhone,
      newContactParentName,
      direction = 'outgoing',
      startedAt,
      durationSeconds = 0,
      outcome,
      notes,
      scheduleFollowUp,
      followUpDate,
      followUpPriority = 'normal',
    } = body;

    if (!outcome) {
      return NextResponse.json({ success: false, error: 'Call outcome is required' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    let targetContactId = contactId;

    // If logging for a new caller not yet in database
    if (!targetContactId && newContactPhone && newContactParentName) {
      const phoneCheck = normalizeIndianPhoneNumber(newContactPhone);
      targetContactId = generateId('cnt');
      db.prepare(`
        INSERT INTO contacts (
          id, parent_name, primary_phone, normalized_phone, course_interest,
          source, status, assigned_to, notes, consent_given, is_archived, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'Sainik School (AISSEE)', 'phone', 'contact_attempted', ?, ?, 1, 0, ?, ?)
      `).run(
        targetContactId,
        newContactParentName.trim(),
        phoneCheck.isValid ? phoneCheck.formattedDisplay : newContactPhone,
        phoneCheck.isValid ? phoneCheck.normalized : newContactPhone.replace(/\D/g, ''),
        session.userId,
        `Created during manual call logging by ${session.username}`,
        now,
        now
      );
    }

    const callLogId = generateId('call');
    const callTime = startedAt || now;

    // Insert Manual Call Log with staff_reported provenance
    db.prepare(`
      INSERT INTO call_logs (
        id, contact_id, direction, started_at, duration_seconds,
        staff_id, outcome, notes, follow_up_needed, follow_up_at,
        created_by, created_at, source, provenance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual_entry', 'staff_reported')
    `).run(
      callLogId,
      targetContactId || null,
      direction,
      callTime,
      parseInt(durationSeconds, 10) || 0,
      session.userId,
      outcome,
      notes || null,
      scheduleFollowUp ? 1 : 0,
      scheduleFollowUp && followUpDate ? followUpDate : null,
      session.username,
      now
    );

    // Update Contact status according to call outcome if connected or interested
    if (targetContactId) {
      let newStatus: string | null = null;
      if (outcome === 'connected') newStatus = 'connected';
      else if (outcome === 'info_provided' || outcome === 'callback_required') newStatus = 'interested';
      else if (outcome === 'not_interested') newStatus = 'not_interested';
      else if (outcome === 'wrong_number') newStatus = 'invalid_contact';

      if (newStatus) {
        db.prepare('UPDATE contacts SET status = ?, updated_at = ? WHERE id = ?').run(newStatus, now, targetContactId);
      }
    }

    // Schedule Follow-up if requested
    if (scheduleFollowUp && followUpDate && targetContactId) {
      const followUpId = generateId('flw');
      db.prepare(`
        INSERT INTO follow_ups (
          id, contact_id, assigned_to, due_at, timezone, status, priority, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'Asia/Kolkata', 'pending', ?, ?, ?, ?)
      `).run(
        followUpId,
        targetContactId,
        session.userId,
        followUpDate,
        followUpPriority,
        `Follow-up from call: ${notes || outcome}`,
        now,
        now
      );
    }

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'LOG_CALL', 'call_logs', ?, ?, ?)
    `).run(
      generateId('aud'),
      session.userId,
      session.username,
      callLogId,
      `Staff logged ${direction} call. Outcome: ${outcome}. Contact: ${targetContactId || 'N/A'}`,
      now
    );

    return NextResponse.json({
      success: true,
      callLogId,
      message: 'Call recorded successfully with staff-reported provenance.',
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to record call log' }, { status: 500 });
  }
}
