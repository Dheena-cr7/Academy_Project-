'use client';

import React, { useState } from 'react';
import { Phone, MessageSquare, Send, Copy, Check } from 'lucide-react';
import QuickEnquiryModal from './QuickEnquiryModal';

interface ContactCTAButtonsProps {
  phone?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  sourceContext?: string;
  variant?: 'hero' | 'compact' | 'footer' | 'inline';
}

export default function ContactCTAButtons({
  phone = '+91 94437 18847',
  whatsappNumber = '919443718847',
  whatsappMessage = 'Hello Kalaivani Sainik RIMC Coaching Centre, I would like to enquire about admission and coaching details for my child.',
  sourceContext = 'Homepage Hero',
  variant = 'hero',
}: ContactCTAButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  const handleCallClick = async () => {
    // Record website click-to-call intent event (honestly labeled as intent, not connected call)
    try {
      navigator.sendBeacon?.(
        '/api/call-intent',
        JSON.stringify({
          sourceContext,
          phone,
          timestamp: new Date().toISOString(),
        })
      ) || fetch('/api/call-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceContext,
          phone,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      });
    } catch {
      // Non-blocking telemetry
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setCopyFeedback(true);
    setTimeout(() => {
      setCopied(false);
      setCopyFeedback(false);
    }, 2500);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
        }}
        role="group"
        aria-label="Direct Admission Contact Options"
      >
        {/* Primary CTA: Enquire About Admissions */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-gold btn-lg"
          style={{
            boxShadow: 'var(--shadow-gold)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          aria-haspopup="dialog"
        >
          <Send size={18} />
          <span>Enquire About Admissions</span>
        </button>

        {/* Call the Centre CTA with Copy Fallback */}
        <div style={{ display: 'inline-flex', alignItems: 'stretch' }}>
          <a
            href={`tel:${cleanPhone}`}
            onClick={handleCallClick}
            className="btn btn-primary btn-lg"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRight: '1px solid rgba(255,255,255,0.2)',
              gap: '8px',
            }}
            title={`Call official admission desk: ${phone}`}
          >
            <Phone size={18} style={{ color: 'var(--gold-light)' }} />
            <span>Call {phone}</span>
          </a>

          <button
            onClick={handleCopy}
            className="btn btn-primary btn-lg"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              padding: '12px 14px',
              backgroundColor: copyFeedback ? '#059669' : 'var(--navy-primary)',
            }}
            title="Copy phone number to clipboard"
            aria-label="Copy phone number to clipboard"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-lg"
          style={{ gap: '8px' }}
          title="Chat on WhatsApp with official admission advisor"
        >
          <MessageSquare size={18} />
          <span>WhatsApp Enquiry</span>
        </a>

        {copyFeedback && (
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--gold-dark)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            aria-live="polite"
          >
            ✓ Number copied to clipboard
          </span>
        )}
      </div>

      {/* Accessible Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCourse=""
      />
    </>
  );
}
