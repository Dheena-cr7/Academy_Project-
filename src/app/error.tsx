'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for monitoring
    console.error('[Application Error Boundary caught error]:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        backgroundColor: '#071325',
        color: '#f8fafc',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      <div
        style={{
          maxWidth: '540px',
          width: '100%',
          backgroundColor: 'rgba(15, 30, 54, 0.95)',
          border: '1px solid rgba(197, 155, 39, 0.3)',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(197, 155, 39, 0.15)',
            border: '1px solid rgba(197, 155, 39, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#e2ba47',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <span
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#e2ba47',
            marginBottom: '8px',
          }}
        >
          Temporary System Notice
        </span>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '12px',
            color: '#ffffff',
            fontFamily: 'var(--font-serif, Georgia, serif)',
          }}
        >
          Something Went Wrong
        </h1>

        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#94a3b8',
            marginBottom: '28px',
          }}
        >
          We apologize for the interruption. Our admissions portal encountered an unexpected runtime exception.
          Your data is safe, and our technical team has logged this incident.
        </p>

        {error.digest && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#64748b',
              marginBottom: '24px',
              fontFamily: 'monospace',
            }}
          >
            Incident Reference: {error.digest}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#c59b27',
              color: '#071325',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d4aa33')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#c59b27')}
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Home size={16} />
            Return Home
          </Link>
        </div>

        <div
          style={{
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.85rem',
            color: '#94a3b8',
          }}
        >
          Need urgent admission assistance?{' '}
          <a
            href="tel:+919443718847"
            style={{
              color: '#e2ba47',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Phone size={14} /> +91 94437 18847
          </a>
        </div>
      </div>
    </div>
  );
}
