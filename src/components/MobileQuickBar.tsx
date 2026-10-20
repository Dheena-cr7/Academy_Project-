'use client';

import React from 'react';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function MobileQuickBar() {
  const phone = '+91 94437 18847';
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const whatsappUrl = `https://wa.me/919443718847?text=${encodeURIComponent(
    'Hello, I would like to enquire about admissions and the academic curriculum at Kalaivani Sainik RIMC Coaching Centre, Amaravathinagar.'
  )}`;

  return (
    <div
      className="mobile-quick-bar"
      role="navigation"
      aria-label="Quick Mobile Admissions Actions"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid rgba(10, 28, 51, 0.12)',
        padding: '8px 12px',
        zIndex: 899,
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxShadow: '0 -4px 20px rgba(10, 28, 51, 0.08)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <a
        href={`tel:${cleanPhone}`}
        onClick={() => trackEvent('click_to_call_mobile_dock')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--academic-navy)',
          fontSize: '0.7rem',
          fontWeight: 700,
          textDecoration: 'none',
          flex: 1,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 28, 51, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Phone size={18} style={{ color: 'var(--academic-crimson)' }} />
        </div>
        <span>Call Desk</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('click_whatsapp_mobile_dock')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#059669',
          fontSize: '0.7rem',
          fontWeight: 700,
          textDecoration: 'none',
          flex: 1,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MessageCircle size={18} style={{ color: '#10b981' }} />
        </div>
        <span>WhatsApp</span>
      </a>

      <a
        href="/#admissions-contact"
        onClick={() => trackEvent('click_enquire_mobile_dock')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--academic-navy)',
          fontSize: '0.7rem',
          fontWeight: 700,
          textDecoration: 'none',
          flex: 1,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileText size={18} style={{ color: 'var(--academic-gold-dark)' }} />
        </div>
        <span>Enquire</span>
      </a>
    </div>
  );
}
