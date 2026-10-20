import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canMergeContacts(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden. Manager role required for contact merge.' }, { status: 403 });
  }

  try {
    const { primaryContactId, secondaryContactId, mergeNotes } = await req.json();

    if (!primaryContactId || !secondaryContactId) {
      return NextResponse.json({ success: false, error: 'Both primary and secondary contact IDs are required' }, { status: 400 });
    }

    if (primaryContactId === secondaryContactId) {
      return NextResponse.json({ success: false, error: 'Cannot merge a contact into itself' }, { status: 400 });
    }

    const db = getDb();
    const primary = db.prepare('SELECT * FROM contacts WHERE id = ?').get(primaryContactId) as Record<string, unknown> | undefined;
    const secondary = db.prepare('SELECT * FROM contacts WHERE id = ?').get(secondaryContactId) as Record<string, unknown> | undefined;

    if (!primary || !secondary) {
      return NextResponse.json({ success: false, error: 'One or both contacts could not be found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Perform database transaction for atomicity
    const mergeTransaction = db.transaction(() => {
      // 1. Move all call logs from secondary to primary
      db.prepare('UPDATE call_logs SET contact_id = ? WHERE contact_id = ?').run(primaryContactId, secondaryContactId);

      // 2. Move all follow-ups from secondary to primary
      db.prepare('UPDATE follow_ups SET contact_id = ? WHERE contact_id = ?').run(primaryContactId, secondaryContactId);

      // 3. Move status history entries
      db.prepare('UPDATE enquiry_status_history SET contact_id = ? WHERE contact_id = ?').run(primaryContactId, secondaryContactId);

      // 4. Append secondary notes to primary contact
      const combinedNotes = `${primary.notes || ''}\n[Merged Contact ${secondaryContactId} on ${now}]:\nSecondary Student: ${secondary.student_name || 'N/A'}\nSecondary Notes: ${secondary.notes || 'None'}\nMerge Reason: ${mergeNotes || 'Duplicate consolidation'}`.trim();

      db.prepare(`
        UPDATE contacts 
        SET 
          notes = ?,
          alternate_phone = COALESCE(alternate_phone, ?),
          updated_at = ?
        WHERE id = ?
      `).run(combinedNotes, secondary.alternate_phone || secondary.primary_phone, now, primaryContactId);

      // 5. Mark secondary contact as duplicate and archive it (soft delete with pointer)
      db.prepare(`
        UPDATE contacts
        SET 
          status = 'duplicate',
          is_archived = 1,
          notes = notes || '\n[Merged into ' || ? || ' on ' || ? || ']',
          updated_at = ?
        WHERE id = ?
      `).run(primaryContactId, now, now, secondaryContactId);

      // 6. Record Reversible Audit Trail with full snapshot of both records
      db.prepare(`
        INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
        VALUES (?, ?, ?, 'MERGE_CONTACTS', 'contacts', ?, ?, ?)
      `).run(
        generateId('aud'),
        session.userId,
        session.username,
        primaryContactId,
        JSON.stringify({
          primaryContactId,
          secondaryContactId,
          notes: mergeNotes,
          primarySnapshot: primary,
          secondarySnapshot: secondary,
        }),
        now
      );
    });

    mergeTransaction();

    return NextResponse.json({
      success: true,
      message: `Successfully merged contact ${secondaryContactId} into primary record ${primaryContactId}.`,
      primaryContactId,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to execute contact merge transaction' }, { status: 500 });
  }
}
