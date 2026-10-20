'use client';

import React, { useState } from 'react';
import {
  Send,
  CheckCircle,
  Phone,
  MessageCircle,
  AlertCircle,
  FileText,
  Lock,
} from 'lucide-react';
import { trackCallIntent } from '@/lib/utils';

interface HeroAdmissionCardProps {
  phone?: string;
  whatsappNumber?: string;
  onOpenProspectus?: () => void;
  onScrollToCalculator?: () => void;
}

export default function HeroAdmissionCard({
  phone = '+91 94437 18847',
  whatsappNumber = '919443718847',
  onOpenProspectus,
  onScrollToCalculator,
}: HeroAdmissionCardProps) {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    courseInterest: 'Sainik School (AISSEE)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const encodedMsg = encodeURIComponent(
    'Hello, I would like to enquire about admissions and hostel facilities at Kalaivani Sainik RIMC Coaching Centre, Amaravathinagar.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[\s\+]/g, '')}?text=${encodedMsg}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanInputPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    const digitsOnly = cleanInputPhone.replace(/^\+91/, '');
    if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!formData.parentName.trim()) {
      setErrorMessage('Please enter the parent or guardian name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: formData.parentName.trim(),
          phone: formData.phone.trim(),
          courseInterest: formData.courseInterest,
          message: 'Quick Callback Request via Homepage Hero Card',
          consentGiven: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setReferenceId(data.enquiryId ? `KS-${String(data.enquiryId).padStart(5, '0')}` : 'KS-ADM2027');
      } else {
        setErrorMessage(data.error || 'Failed to submit. Please call our admissions desk directly.');
      }
    } catch {
      setErrorMessage('Network error. Please call our admissions desk directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(197, 160, 89, 0.3)',
        color: 'var(--text-dark)',
        overflow: 'hidden',
      }}
    >
      {/* Clean Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy-darkest) 0%, var(--navy-surface) 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          borderBottom: '2px solid var(--gold-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              color: 'var(--gold-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Admissions Open 2026–2027
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.3rem',
              fontWeight: 800,
              margin: '2px 0 0 0',
              color: '#ffffff',
            }}
          >
            Quick Admission Callback
          </h3>
        </div>
        <span
          style={{
            backgroundColor: 'rgba(197, 160, 89, 0.18)',
            border: '1px solid var(--gold-border)',
            color: 'var(--gold-light)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px',
          }}
        >
          Hostel Seats Open
        </span>
      </div>

      {submitted ? (
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid #a7f3d0',
            }}
          >
            <CheckCircle size={32} />
          </div>

          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              color: 'var(--navy-primary)',
              marginBottom: '6px',
            }}
          >
            Enquiry Received!
          </h4>

          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#f1f5f9',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--navy-primary)',
              marginBottom: '14px',
              border: '1px solid #cbd5e1',
            }}
          >
            Ref: {referenceId}
          </div>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-dark-muted)',
              marginBottom: '20px',
              lineHeight: '1.5',
            }}
          >
            Thank you, <strong>{formData.parentName}</strong>. Our Admissions Counsellor at Amaravathinagar will call you within <strong>15 minutes</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => trackCallIntent('Hero Success Direct Call', phone)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Phone size={16} />
              <span>Call Desk Directly: {phone}</span>
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
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={16} fill="#ffffff" />
              <span>Continue on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
            Fill in your details for an immediate callback regarding fees, batch induction, and residential hostel admission:
          </p>

          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--navy-primary)',
                marginBottom: '5px',
              }}
            >
              Parent / Guardian Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. S. Murugesan"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--navy-primary)',
                marginBottom: '5px',
              }}
            >
              Contact Mobile Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 94437 18847"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--navy-primary)',
                marginBottom: '5px',
              }}
            >
              Target Course / Standard *
            </label>
            <select
              value={formData.courseInterest}
              onChange={(e) => setFormData({ ...formData, courseInterest: e.target.value })}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="Sainik School (AISSEE)">Sainik School (Class VI & IX)</option>
              <option value="RIMC Dehradun">RIMC Dehradun (Class VIII Entry)</option>
              <option value="Rashtriya Military Schools (RMS)">Rashtriya Military Schools (RMS CET)</option>
              <option value="Summer Residential Batch">Summer Foundation & Crash Course</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-gold-foil"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Get Instant Callback & Details</span>
              </>
            )}
          </button>

          {/* Quick Instant Links */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <a
              href={`tel:${cleanPhone}`}
              onClick={() => trackCallIntent('Hero Quick Dial', phone)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                color: 'var(--navy-primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Phone size={13} style={{ color: 'var(--gold-dark)' }} />
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
                gap: '6px',
                padding: '8px',
                backgroundColor: 'rgba(37, 211, 102, 0.08)',
                borderRadius: '6px',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                color: '#16a34a',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={13} fill="#16a34a" />
              <span>WhatsApp</span>
            </a>
          </div>
        </form>
      )}

      {/* Trust Footer */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          padding: '12px 24px',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.75rem',
          color: 'var(--text-dark-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={12} style={{ color: '#10b981' }} />
          <span>Strict Privacy • Direct Institutional Contact</span>
        </div>
        <span style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
          Amaravathinagar
        </span>
      </div>
    </div>
  );
}
