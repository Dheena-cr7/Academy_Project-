import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, getSessionUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';

export async function POST() {
  try {
    const user = getSessionUser();
    if (user) {
      const db = getDb();
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
        VALUES (?, ?, ?, 'USER_LOGOUT', 'users', ?, 'Staff logged out', ?)
      `).run(generateId('aud'), user.userId, user.username, user.userId, now);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}
