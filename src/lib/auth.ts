import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'ks_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'kalaivani-sainik-coaching-secret-key-2026-secure';

export type UserRole = 'super_admin' | 'manager' | 'counsellor' | 'content_editor' | 'auditor';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: number;
}

/**
 * Hash password with salt using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored salt:hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(computedHash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Create a signed session token
 */
export function createSessionToken(user: AuthUser): string {
  const payload = JSON.stringify({
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string): { userId: string; username: string; role: UserRole } | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) {
      return null;
    }
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Get current session user in Server Components and Route Handlers
 */
export function getSessionUser(): { userId: string; username: string; role: UserRole } | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Permission checks based on user role
 */
export const permissions = {
  canManageStaff(role: UserRole): boolean {
    return role === 'super_admin';
  },
  canManageSettings(role: UserRole): boolean {
    return role === 'super_admin';
  },
  canExportReports(role: UserRole): boolean {
    return role === 'super_admin' || role === 'manager';
  },
  canEditCms(role: UserRole): boolean {
    return role === 'super_admin' || role === 'manager' || role === 'content_editor';
  },
  canManageContacts(role: UserRole): boolean {
    return role === 'super_admin' || role === 'manager' || role === 'counsellor';
  },
  canLogCalls(role: UserRole): boolean {
    return role === 'super_admin' || role === 'manager' || role === 'counsellor';
  },
  canMergeContacts(role: UserRole): boolean {
    return role === 'super_admin' || role === 'manager';
  },
  canViewAuditLogs(role: UserRole): boolean {
    return role === 'super_admin' || role === 'auditor';
  },
};

export { SESSION_COOKIE_NAME };
