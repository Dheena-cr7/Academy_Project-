import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { normalizeIndianPhoneNumber, generateId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';
  const status = searchParams.get('status') || '';
  const assignedTo = searchParams.get('assignedTo') || '';
  const showArchived = searchParams.get('archived') === 'true';

  try {
    const db = getDb();
    let sql = `
      SELECT 
        c.*,
        u.full_name as assigned_staff_name,
        (SELECT COUNT(*) FROM contacts c2 WHERE c2.normalized_phone = c.normalized_phone AND c2.id != c.id AND c2.is_archived = 0) as duplicate_count,
        (SELECT COUNT(*) FROM call_logs cl WHERE cl.contact_id = c.id) as total_calls,
        (SELECT COUNT(*) FROM follow_ups fu WHERE fu.contact_id = c.id AND fu.status = 'pending') as pending_follow_ups
      FROM contacts c
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.is_archived = ?
    `;
    const params: unknown[] = [showArchived ? 1 : 0];

    if (q) {
      // Check if q can be a normalized phone number
      const cleanedDigits = q.replace(/\D/g, '');
      if (cleanedDigits.length >= 4) {
        sql += ` AND (c.normalized_phone LIKE ? OR c.parent_name LIKE ? OR c.student_name LIKE ? OR c.id LIKE ?)`;
        params.push(`%${cleanedDigits}%`, `%${q}%`, `%${q}%`, `%${q}%`);
      } else {
        sql += ` AND (c.parent_name LIKE ? OR c.student_name LIKE ? OR c.id LIKE ? OR c.course_interest LIKE ?)`;
        params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
      }
    }

    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }

    if (assignedTo) {
      sql += ` AND c.assigned_to = ?`;
      params.push(assignedTo);
    }

    sql += ` ORDER BY c.created_at DESC LIMIT 100`;

    const contacts = db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, contacts });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canManageContacts(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      parentName,
      studentName,
      primaryPhone,
      alternatePhone,
      email,
      courseInterest,
      source = 'phone',
      status = 'new',
      assignedTo,
      notes,
    } = body;

    if (!parentName || !primaryPhone) {
      return NextResponse.json({ success: false, error: 'Parent name and phone number are required' }, { status: 400 });
    }

    const phoneCheck = normalizeIndianPhoneNumber(primaryPhone);
    if (!phoneCheck.isValid) {
      return NextResponse.json({ success: false, error: phoneCheck.error || 'Invalid Indian phone number' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    const contactId = generateId('cnt');

    db.prepare(`
      INSERT INTO contacts (
        id, parent_name, student_name, primary_phone, normalized_phone,
        alternate_phone, email, course_interest, source, status,
        assigned_to, notes, consent_given, is_archived, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?)
    `).run(
      contactId,
      parentName.trim(),
      studentName ? studentName.trim() : null,
      phoneCheck.formattedDisplay,
      phoneCheck.normalized,
      alternatePhone ? alternatePhone.trim() : null,
      email ? email.trim() : null,
      courseInterest || 'Sainik School (AISSEE)',
      source,
      status,
      assignedTo || session.userId,
      notes || null,
      now,
      now
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'CREATE_CONTACT', 'contacts', ?, ?, ?)
    `).run(
      generateId('aud'),
      session.userId,
      session.username,
      contactId,
      `Created contact for parent: ${parentName.trim()} (${phoneCheck.formattedDisplay})`,
      now
    );

    const created = db.prepare('SELECT * FROM contacts WHERE id = ?').get(contactId);
    return NextResponse.json({ success: true, contact: created });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to create contact' }, { status: 500 });
  }
}
