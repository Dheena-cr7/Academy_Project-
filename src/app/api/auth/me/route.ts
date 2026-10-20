import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const db = getDb();
  const user = db
    .prepare('SELECT id, username, email, full_name, role, is_active FROM users WHERE id = ?')
    .get(session.userId) as
    | { id: string; username: string; email: string; full_name: string; role: string; is_active: number }
    | undefined;

  if (!user || !user.is_active) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
  });
}
