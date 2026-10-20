import React from 'react';
import Link from 'next/link';
import { Shield, Home, Phone, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '580px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 25, 47, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--navy-primary)',
            marginBottom: '24px',
          }}
        >
          <Shield size={38} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '3rem',
            color: 'var(--navy-primary)',
            lineHeight: '1.2',
            marginBottom: '12px',
          }}
        >
          404 - Page Not Found
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-dark-muted)',
            lineHeight: '1.6',
            marginBottom: '32px',
          }}
        >
          The page you are looking for may have been moved, renamed, or is temporarily unavailable. Let us help you find the right information.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Return to Homepage
          </Link>
          <Link href="/courses" className="btn btn-secondary btn-lg">
            View Programmes
          </Link>
          <a href="tel:+919443718847" className="btn btn-gold btn-lg">
            <Phone size={18} /> Call Admission Desk
          </a>
        </div>
      </div>
    </div>
  );
}
