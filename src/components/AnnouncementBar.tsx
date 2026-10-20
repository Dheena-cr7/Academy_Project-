'use client';

import React from 'react';
import { ShieldCheck, Phone } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  phone?: string;
}

export default function AnnouncementBar({
  text = 'Admissions Open for 2026–2027 Entrance Batches: AISSEE Sainik School (Class VI & IX), RIMC Dehradun & RMS CET',
  phone = '+91 94437 18847',
}: AnnouncementBarProps) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  return (
    <aside
      aria-label="Official Academic Announcement"
      style={{
        backgroundColor: '#040d1a',
        color: '#ffffff',
        fontSize: '0.8rem',
        padding: '9px 16px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
        position: 'relative',
        zIndex: 950,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Notice Badge & Ticker Text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1,
            minWidth: '280px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: 'var(--academic-gold-light)',
              padding: '2px 9px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--academic-gold)',
                boxShadow: '0 0 8px var(--academic-gold)',
                display: 'inline-block',
              }}
            />
            Official Notice
          </span>
          <span
            style={{
              color: '#e2e8f0',
              fontWeight: 500,
              fontSize: '0.825rem',
              letterSpacing: '0.01em',
            }}
          >
            {text}
          </span>
        </div>

        {/* Right Info: Campus Landmark & Direct Contact */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '0.785rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--academic-gold-light)',
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--academic-gold)' }} />
            <span>Amaravathinagar Campus</span>
          </div>

          <a
            href={`tel:${cleanPhone}`}
            className="announcement-phone-btn"
            title="Call Admissions Desk"
          >
            <Phone size={12} style={{ color: 'var(--academic-gold-light)' }} />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
