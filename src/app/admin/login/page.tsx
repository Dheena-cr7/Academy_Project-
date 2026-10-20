'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Kalaivani@2026Admin');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--navy-darkest)',
        padding: '24px',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: 'var(--gold-primary)',
              color: '#070e1b',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-gold)',
              marginBottom: '16px',
            }}
          >
            <Shield size={32} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.85rem',
              color: 'var(--ivory-white)',
              lineHeight: '1.2',
            }}
          >
            Kalaivani Sainik Academy
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
            CRM & Admission Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '36px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '8px' }}>
            Staff Sign In
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '24px' }}>
            Enter your authorized staff credentials to manage calls and enquiries.
          </p>

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: '4px',
                marginBottom: '18px',
                fontSize: '0.85rem',
              }}
              role="alert"
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="login_user">
                Staff Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login_user"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-dark-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login_pass">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login_pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-dark-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: '12px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div
            style={{
              marginTop: '24px',
              padding: '14px',
              backgroundColor: 'var(--ivory-light)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--ivory-muted)',
              fontSize: '0.785rem',
              color: 'var(--text-dark-muted)',
            }}
          >
            <strong style={{ color: 'var(--navy-primary)', display: 'block', marginBottom: '4px' }}>
              Evaluation Credentials:
            </strong>
            <div>• Super Admin: <code style={{ color: 'var(--navy-primary)' }}>admin</code> / <code style={{ color: 'var(--navy-primary)' }}>Kalaivani@2026Admin</code></div>
            <div>• Counsellor: <code style={{ color: 'var(--navy-primary)' }}>counsellor1</code> / <code style={{ color: 'var(--navy-primary)' }}>Counsellor@2026</code></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-light-muted)' }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
