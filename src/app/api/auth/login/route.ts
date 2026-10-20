import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, AuthUser } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const db = getDb();
    const user = db
      .prepare('SELECT id, username, email, password_hash, full_name, role, is_active FROM users WHERE username = ?')
      .get(username.trim()) as
      | { id: string; username: string; email: string; password_hash: string; full_name: string; role: any; is_active: number }
      | undefined;

    if (!user || !user.is_active) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }

    const isMatch = verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      isActive: user.is_active,
    };

    const token = createSessionToken(authUser);
    const now = new Date().toISOString();

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'USER_LOGIN', 'users', ?, 'Successful staff login via password', ?)
    `).run(generateId('aud'), user.id, user.username, user.id, now);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day
    });

    return response;
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Authentication service error' }, { status: 500 });
  }
}
