'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#071325',
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            textAlign: 'center',
            backgroundColor: '#0f1e36',
            border: '1px solid #c59b27',
            borderRadius: '16px',
            padding: '40px 24px',
          }}
        >
          <h2 style={{ color: '#e2ba47', margin: '0 0 16px' }}>Critical System Notice</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, margin: '0 0 24px' }}>
            A critical error occurred while initializing the portal. Please refresh or contact admissions administration.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#c59b27',
              color: '#071325',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload Portal
          </button>
        </div>
      </body>
    </html>
  );
}
