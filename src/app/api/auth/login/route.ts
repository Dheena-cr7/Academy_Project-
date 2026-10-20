import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, AuthUser } from '@/lib/auth';
import { generateId } from '@/lib/utils';

// In-memory brute-force protection map (Max 5 failed attempts per 15 min per IP/Username)
interface AttemptRecord {
  failures: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, AttemptRecord>();

const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const now = Date.now();
    const isoNow = new Date().toISOString();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const cleanUsername = String(username).trim();
    const rateLimitKey = `${ip}:${cleanUsername.toLowerCase()}`;

    // 1. Check Rate Limit / Lockout
    const attempt = loginAttempts.get(rateLimitKey);
    if (attempt && attempt.lockedUntil > now) {
      const remainingSecs = Math.ceil((attempt.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Account temporarily locked due to multiple failed attempts. Please try again in ${Math.ceil(remainingSecs / 60)} minutes.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(remainingSecs) },
        }
      );
    }

    const db = getDb();
    const user = db
      .prepare('SELECT id, username, email, password_hash, full_name, role, is_active FROM users WHERE username = ?')
      .get(cleanUsername) as
      | { id: string; username: string; email: string; password_hash: string; full_name: string; role: any; is_active: number }
      | undefined;

    const isMatch = user && user.is_active ? verifyPassword(password, user.password_hash) : false;

    // 2. Handle Failed Login
    if (!isMatch) {
      const currentFailures = (attempt ? attempt.failures : 0) + 1;
      const isNowLocked = currentFailures >= MAX_FAILURES;
      const lockedUntil = isNowLocked ? now + LOCKOUT_MS : 0;

      loginAttempts.set(rateLimitKey, {
        failures: currentFailures,
        lockedUntil,
      });

      // Audit log failed attempt with IP and attempted username
      try {
        db.prepare(`
          INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, ip_address, created_at)
          VALUES (?, 'unauthenticated', ?, 'LOGIN_FAILED', 'users', ?, ?, ?, ?)
        `).run(
          generateId('aud'),
          cleanUsername,
          user?.id || 'unknown',
          `Failed login attempt (${currentFailures}/${MAX_FAILURES}) from IP: ${ip}`,
          ip,
          isoNow
        );
      } catch (auditErr) {
        console.error('[AUDIT ERROR] Could not record failed login:', auditErr);
      }

      if (isNowLocked) {
        return NextResponse.json(
          {
            success: false,
            error: `Too many failed login attempts. This account is locked for 15 minutes for security.`,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid username or password',
          remainingAttempts: MAX_FAILURES - currentFailures,
        },
        { status: 401 }
      );
    }

    // 3. Handle Successful Login
    // Clear failed attempts counter
    loginAttempts.delete(rateLimitKey);

    const authUser: AuthUser = {
      id: user!.id,
      username: user!.username,
      email: user!.email,
      fullName: user!.full_name,
      role: user!.role,
      isActive: user!.is_active,
    };

    const token = createSessionToken(authUser);

    // Audit log successful login
    try {
      db.prepare(`
        INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, ip_address, created_at)
        VALUES (?, ?, ?, 'USER_LOGIN', 'users', ?, 'Successful staff login via password', ?, ?)
      `).run(generateId('aud'), user!.id, user!.username, user!.id, ip, isoNow);
    } catch (auditErr) {
      console.error('[AUDIT ERROR] Could not record user login:', auditErr);
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user!.id,
        username: user!.username,
        fullName: user!.full_name,
        role: user!.role,
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
    console.error('[AUTH EXCEPTION]:', err);
    return NextResponse.json({ success: false, error: 'Authentication service error' }, { status: 500 });
  }
}
