import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { sanitizeForCsv, generateId, formatToKolkata } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canExportReports(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format'); // 'json' | 'csv'
  const entity = searchParams.get('entity') || 'enquiries'; // 'enquiries' | 'calls'

  try {
    const db = getDb();
    const now = new Date().toISOString();

    if (entity === 'enquiries') {
      const contacts = db
        .prepare(`
          SELECT 
            c.id, c.parent_name, c.student_name, c.primary_phone, c.normalized_phone,
            c.course_interest, c.source, c.status, c.created_at, c.updated_at,
            u.full_name as assigned_staff
          FROM contacts c
          LEFT JOIN users u ON c.assigned_to = u.id
          ORDER BY c.created_at DESC
        `)
        .all() as Record<string, unknown>[];

      // If CSV export requested
      if (format === 'csv') {
        const headers = [
          'Enquiry ID',
          'Parent Name',
          'Student Name',
          'Primary Phone',
          'Normalized Phone',
          'Course Interest',
          'Source',
          'Status',
          'Assigned Staff',
          'Created Date (IST)',
        ];

        const rows = contacts.map((c) => [
          sanitizeForCsv(c.id),
          sanitizeForCsv(c.parent_name),
          sanitizeForCsv(c.student_name || 'N/A'),
          sanitizeForCsv(c.primary_phone),
          sanitizeForCsv(c.normalized_phone),
          sanitizeForCsv(c.course_interest),
          sanitizeForCsv(c.source),
          sanitizeForCsv(c.status),
          sanitizeForCsv(c.assigned_staff || 'Unassigned'),
          sanitizeForCsv(formatToKolkata(c.created_at as string)),
        ]);

        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

        // Audit Log for data export
        db.prepare(`
          INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
          VALUES (?, ?, ?, 'EXPORT_CSV', 'contacts', 'all', 'Exported contacts CSV with CSV formula injection protection', ?)
        `).run(generateId('aud'), session.userId, session.username, now);

        return new Response(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="kalaivani_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        });
      }

      // Aggregate report metrics
      const bySource = db.prepare('SELECT source, COUNT(*) as count FROM contacts GROUP BY source').all();
      const byCourse = db.prepare('SELECT course_interest, COUNT(*) as count FROM contacts GROUP BY course_interest').all();
      const byStatus = db.prepare('SELECT status, COUNT(*) as count FROM contacts GROUP BY status').all();

      return NextResponse.json({
        success: true,
        summary: { bySource, byCourse, byStatus, totalContacts: contacts.length },
        contacts,
      });
    }

    if (entity === 'calls') {
      const calls = db
        .prepare(`
          SELECT 
            cl.id, cl.started_at, cl.direction, cl.duration_seconds, cl.outcome,
            cl.source, cl.provenance, cl.notes,
            c.parent_name, c.primary_phone,
            u.full_name as staff_name
          FROM call_logs cl
          LEFT JOIN contacts c ON cl.contact_id = c.id
          LEFT JOIN users u ON cl.staff_id = u.id
          ORDER BY cl.started_at DESC
        `)
        .all() as Record<string, unknown>[];

      if (format === 'csv') {
        const headers = [
          'Call ID',
          'Direction',
          'Provenance',
          'Source',
          'Outcome',
          'Duration (s)',
          'Parent Name',
          'Phone',
          'Staff Name',
          'Started At (IST)',
          'Notes',
        ];

        const rows = calls.map((cl) => [
          sanitizeForCsv(cl.id),
          sanitizeForCsv(cl.direction),
          sanitizeForCsv(cl.provenance),
          sanitizeForCsv(cl.source),
          sanitizeForCsv(cl.outcome),
          sanitizeForCsv(cl.duration_seconds),
          sanitizeForCsv(cl.parent_name || 'N/A'),
          sanitizeForCsv(cl.primary_phone || 'N/A'),
          sanitizeForCsv(cl.staff_name || 'System'),
          sanitizeForCsv(formatToKolkata(cl.started_at as string)),
          sanitizeForCsv(cl.notes || ''),
        ]);

        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

        // Audit Log
        db.prepare(`
          INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
          VALUES (?, ?, ?, 'EXPORT_CSV', 'call_logs', 'all', 'Exported call logs CSV with formula injection defense', ?)
        `).run(generateId('aud'), session.userId, session.username, now);

        return new Response(csvContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="kalaivani_calls_${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        });
      }

      return NextResponse.json({ success: true, calls });
    }

    return NextResponse.json({ success: false, error: 'Unknown report entity' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to generate report' }, { status: 500 });
  }
}
