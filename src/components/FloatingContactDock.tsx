'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { trackCallIntent } from '@/lib/utils';

interface FloatingContactDockProps {
  phone?: string;
  whatsappNumber?: string;
}

export default function FloatingContactDock({
  phone = '+91 94437 18847',
  whatsappNumber = '919443718847',
}: FloatingContactDockProps) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const encodedMsg = encodeURIComponent(
    'Hello, I would like to enquire about admissions and hostel facilities at Kalaivani Sainik RIMC Coaching Centre, Amaravathinagar.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[\s\+]/g, '')}?text=${encodedMsg}`;

  return (
    <>
      {/* 1. Desktop Floating WhatsApp Button (Bottom-Right) */}
      <div
        className="floating-whatsapp-desktop"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px',
        }}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#25d366',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          className="whatsapp-float-btn"
          aria-label="Chat with Admissions Desk on WhatsApp"
        >
          <MessageCircle size={20} fill="#ffffff" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      {/* 2. Mobile Sticky Bottom Contact Bar (Visible on phones only) */}
      <div
        className="mobile-bottom-dock"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
          padding: '10px 16px',
          display: 'none',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          zIndex: 998,
        }}
      >
        <a
          href={`tel:${cleanPhone}`}
          onClick={() => trackCallIntent('Mobile Dock Direct Call', phone)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'var(--navy-primary)',
            color: '#ffffff',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          <Phone size={18} style={{ color: 'var(--gold-light)' }} />
          <span>Call Desk</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#25d366',
            color: '#ffffff',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          <MessageCircle size={18} fill="#ffffff" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
}
