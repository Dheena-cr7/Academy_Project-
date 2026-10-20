import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const db = getDb();
    const settings = db.prepare('SELECT * FROM contact_settings WHERE id = ?').get('default');
    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getSessionUser();
    if (!user || !permissions.canManageSettings(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE contact_settings
      SET 
        institution_name = ?,
        display_phone = ?,
        international_phone = ?,
        tel_uri = ?,
        whatsapp_number = ?,
        whatsapp_message = ?,
        email = ?,
        address = ?,
        directions_url = ?,
        office_hours = ?,
        announcement_bar_text = ?,
        announcement_bar_enabled = ?,
        updated_at = ?,
        updated_by = ?
      WHERE id = 'default'
    `).run(
      body.institution_name,
      body.display_phone,
      body.international_phone,
      body.tel_uri,
      body.whatsapp_number,
      body.whatsapp_message,
      body.email,
      body.address,
      body.directions_url,
      body.office_hours,
      body.announcement_bar_text,
      body.announcement_bar_enabled ? 1 : 0,
      now,
      user.username
    );

    // Record audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'UPDATE_SETTINGS', 'contact_settings', 'default', ?, ?)
    `).run(
      generateId('aud'),
      user.userId,
      user.username,
      `Updated central contact settings. Phone: ${body.display_phone}, Email: ${body.email}`,
      now
    );

    const updated = db.prepare('SELECT * FROM contact_settings WHERE id = ?').get('default');
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
