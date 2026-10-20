import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { normalizeIndianPhoneNumber, generateId } from '@/lib/utils';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const contact = db
      .prepare(`
        SELECT c.*, u.full_name as assigned_staff_name
        FROM contacts c
        LEFT JOIN users u ON c.assigned_to = u.id
        WHERE c.id = ?
      `)
      .get(params.id) as Record<string, unknown> | undefined;

    if (!contact) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    // Call history for this contact
    const calls = db
      .prepare(`
        SELECT cl.*, u.full_name as staff_name
        FROM call_logs cl
        LEFT JOIN users u ON cl.staff_id = u.id
        WHERE cl.contact_id = ?
        ORDER BY cl.started_at DESC
      `)
      .all(params.id);

    // Follow-ups for this contact
    const followUps = db
      .prepare(`
        SELECT fu.*, u.full_name as assigned_staff_name
        FROM follow_ups fu
        LEFT JOIN users u ON fu.assigned_to = u.id
        WHERE fu.contact_id = ?
        ORDER BY fu.due_at DESC
      `)
      .all(params.id);

    // Status transition history
    const statusHistory = db
      .prepare(`
        SELECT esh.*, u.full_name as actor_name
        FROM enquiry_status_history esh
        LEFT JOIN users u ON esh.actor_id = u.id
        WHERE esh.contact_id = ?
        ORDER BY esh.created_at DESC
      `)
      .all(params.id);

    // Check for potential duplicate contacts sharing normalized phone
    const duplicates = db
      .prepare(`
        SELECT id, parent_name, student_name, primary_phone, course_interest, status, created_at
        FROM contacts
        WHERE normalized_phone = ? AND id != ? AND is_archived = 0
      `)
      .all(contact.normalized_phone, params.id);

    return NextResponse.json({
      success: true,
      contact,
      calls,
      followUps,
      statusHistory,
      duplicates,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve contact details' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionUser();
  if (!session || !permissions.canManageContacts(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const db = getDb();
    const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(params.id) as Record<string, unknown> | undefined;

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const phoneCheck = body.primaryPhone ? normalizeIndianPhoneNumber(body.primaryPhone) : null;

    const normalizedPhone = phoneCheck?.isValid ? phoneCheck.normalized : existing.normalized_phone;
    const formattedPhone = phoneCheck?.isValid ? phoneCheck.formattedDisplay : existing.primary_phone;

    // Check status transition
    if (body.status && body.status !== existing.status) {
      db.prepare(`
        INSERT INTO enquiry_status_history (id, contact_id, old_status, new_status, actor_id, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateId('esh'),
        params.id,
        existing.status,
        body.status,
        session.userId,
        body.statusNotes || `Status updated to ${body.status} by ${session.username}`,
        now
      );
    }

    db.prepare(`
      UPDATE contacts
      SET 
        parent_name = COALESCE(?, parent_name),
        student_name = ?,
        primary_phone = ?,
        normalized_phone = ?,
        alternate_phone = ?,
        email = ?,
        course_interest = COALESCE(?, course_interest),
        status = COALESCE(?, status),
        assigned_to = ?,
        notes = ?,
        is_archived = COALESCE(?, is_archived),
        updated_at = ?
      WHERE id = ?
    `).run(
      body.parentName?.trim() || null,
      body.studentName ? body.studentName.trim() : null,
      formattedPhone,
      normalizedPhone,
      body.alternatePhone ? body.alternatePhone.trim() : null,
      body.email ? body.email.trim() : null,
      body.courseInterest || null,
      body.status || null,
      body.assignedTo !== undefined ? body.assignedTo : existing.assigned_to,
      body.notes !== undefined ? body.notes : existing.notes,
      body.isArchived !== undefined ? (body.isArchived ? 1 : 0) : existing.is_archived,
      now,
      params.id
    );

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'UPDATE_CONTACT', 'contacts', ?, ?, ?)
    `).run(
      generateId('aud'),
      session.userId,
      session.username,
      params.id,
      `Updated contact details for ID ${params.id}. Status: ${body.status || existing.status}`,
      now
    );

    const updated = db.prepare('SELECT * FROM contacts WHERE id = ?').get(params.id);
    return NextResponse.json({ success: true, contact: updated });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionUser();
  if (!session || !permissions.canManageContacts(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const db = getDb();
    const now = new Date().toISOString();

    // Soft deletion (archival) with audit trail
    db.prepare('UPDATE contacts SET is_archived = 1, updated_at = ? WHERE id = ?').run(now, params.id);

    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'ARCHIVE_CONTACT', 'contacts', ?, 'Contact archived (soft deleted)', ?)
    `).run(generateId('aud'), session.userId, session.username, params.id, now);

    return NextResponse.json({ success: true, message: 'Contact archived successfully' });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to archive contact' }, { status: 500 });
  }
}
