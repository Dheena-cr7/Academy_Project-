import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions, hashPassword } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const staff = db
      .prepare(`
        SELECT id, username, email, full_name, role, is_active, created_at, updated_at
        FROM users
        ORDER BY created_at ASC
      `)
      .all();
    return NextResponse.json({ success: true, staff });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch staff members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canManageStaff(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden. Super Admin only.' }, { status: 403 });
  }

  try {
    const { username, password, fullName, email, role } = await req.json();

    if (!username || !password || !fullName || !role) {
      return NextResponse.json({ success: false, error: 'Missing required staff fields' }, { status: 400 });
    }

    const validRoles = ['super_admin', 'manager', 'counsellor', 'content_editor', 'auditor'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid staff role specified' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());
    if (existing) {
      return NextResponse.json({ success: false, error: 'A staff member with this username already exists' }, { status: 400 });
    }

    const id = generateId('usr');
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(id, username.trim(), email ? email.trim() : null, passwordHash, fullName.trim(), role, now, now);

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'CREATE_STAFF', 'users', ?, ?, ?)
    `).run(generateId('aud'), session.userId, session.username, id, `Created staff account: ${username.trim()} with role ${role}`, now);

    return NextResponse.json({ success: true, message: 'Staff account created successfully', staffId: id });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to create staff account' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canManageStaff(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden. Super Admin only.' }, { status: 403 });
  }

  try {
    const { id, role, isActive, password } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    if (password) {
      const newHash = hashPassword(password);
      db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(newHash, now, id);
    }

    if (role) {
      db.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?').run(role, now, id);
    }

    if (isActive !== undefined) {
      db.prepare('UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?').run(isActive ? 1 : 0, now, id);
    }

    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'UPDATE_STAFF', 'users', ?, ?, ?)
    `).run(generateId('aud'), session.userId, session.username, id, `Updated staff account settings for ${id}`, now);

    return NextResponse.json({ success: true, message: 'Staff member updated successfully' });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to update staff member' }, { status: 500 });
  }
}
