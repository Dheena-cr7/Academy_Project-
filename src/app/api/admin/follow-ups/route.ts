import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') || 'all'; // 'today' | 'overdue' | 'upcoming' | 'completed' | 'unassigned' | 'all'
  const assignedTo = searchParams.get('assignedTo');

  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    let sql = `
      SELECT 
        fu.*,
        c.parent_name,
        c.student_name,
        c.primary_phone,
        c.course_interest,
        c.status as contact_status,
        u.full_name as assigned_staff_name,
        (
          SELECT cl.outcome FROM call_logs cl 
          WHERE cl.contact_id = fu.contact_id 
          ORDER BY cl.started_at DESC LIMIT 1
        ) as last_call_outcome
      FROM follow_ups fu
      LEFT JOIN contacts c ON fu.contact_id = c.id
      LEFT JOIN users u ON fu.assigned_to = u.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (filter === 'today') {
      sql += ` AND fu.status = 'pending' AND fu.due_at LIKE ?`;
      params.push(`${today}%`);
    } else if (filter === 'overdue') {
      sql += ` AND fu.status = 'pending' AND fu.due_at < ?`;
      params.push(nowIso);
    } else if (filter === 'upcoming') {
      sql += ` AND fu.status = 'pending' AND fu.due_at > ?`;
      params.push(nowIso);
    } else if (filter === 'completed') {
      sql += ` AND fu.status = 'completed'`;
    } else if (filter === 'unassigned') {
      sql += ` AND fu.status = 'pending' AND (fu.assigned_to IS NULL OR fu.assigned_to = '')`;
    }

    if (assignedTo) {
      sql += ` AND fu.assigned_to = ?`;
      params.push(assignedTo);
    }

    sql += ` ORDER BY fu.due_at ASC LIMIT 100`;

    const followUps = db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, followUps });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve follow-ups' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canManageContacts(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id, action, dueAt, notes, assignedTo } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Follow-up ID is required' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT * FROM follow_ups WHERE id = ?').get(id) as Record<string, unknown> | undefined;

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Follow-up not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    if (action === 'complete') {
      db.prepare(`
        UPDATE follow_ups 
        SET status = 'completed', completed_at = ?, completed_by = ?, notes = COALESCE(?, notes), updated_at = ?
        WHERE id = ?
      `).run(now, session.username, notes || 'Completed by staff', now, id);
    } else if (action === 'reschedule') {
      if (!dueAt) {
        return NextResponse.json({ success: false, error: 'New due date/time is required to reschedule' }, { status: 400 });
      }
      db.prepare(`
        UPDATE follow_ups 
        SET due_at = ?, status = 'pending', notes = COALESCE(?, notes), updated_at = ?
        WHERE id = ?
      `).run(dueAt, notes || `Rescheduled to ${dueAt}`, now, id);
    } else if (action === 'reassign') {
      db.prepare(`
        UPDATE follow_ups 
        SET assigned_to = ?, updated_at = ?
        WHERE id = ?
      `).run(assignedTo, now, id);
    } else if (action === 'cancel') {
      db.prepare(`
        UPDATE follow_ups 
        SET status = 'cancelled', updated_at = ?
        WHERE id = ?
      `).run(now, id);
    }

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'UPDATE_FOLLOWUP', 'follow_ups', ?, ?, ?)
    `).run(
      generateId('aud'),
      session.userId,
      session.username,
      id,
      `Action: ${action} on follow-up ${id}. Notes: ${notes || 'None'}`,
      now
    );

    const updated = db.prepare('SELECT * FROM follow_ups WHERE id = ?').get(id);
    return NextResponse.json({ success: true, followUp: updated });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to update follow-up' }, { status: 500 });
  }
}
