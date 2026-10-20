'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Phone, Lock, Clock } from 'lucide-react';
import { normalizeIndianPhoneNumber } from '../lib/utils';

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export default function QuickEnquiryModal({
  isOpen,
  onClose,
  defaultCourse = 'Sainik School (AISSEE)',
}: QuickEnquiryModalProps) {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState(defaultCourse || 'Sainik School (AISSEE)');
  const [callbackWindow, setCallbackWindow] = useState('Morning (09:00 AM – 12:00 PM)');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Initialize idempotency key and handle ESC key
  useEffect(() => {
    if (isOpen) {
      setIdempotencyKey(`enq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
      setStatus('idle');
      setErrorMessage('');
      setPhoneError('');
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validatePhoneInput = (val: string) => {
    setPhone(val);
    if (!val) {
      setPhoneError('');
      return;
    }
    const check = normalizeIndianPhoneNumber(val);
    if (!check.isValid && val.length >= 10) {
      setPhoneError(check.error || 'Invalid Indian mobile number');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot
    if (honeypot) {
      // Bot detected, silently exit
      setStatus('success');
      return;
    }

    // Validate phone
    const phoneCheck = normalizeIndianPhoneNumber(phone);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.error || 'Please enter a valid 10-digit Indian phone number');
      return;
    }

    if (!consent) {
      setErrorMessage('Please consent to allow our admission counsellor to contact you.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          parentName: parentName.trim(),
          phone: phone.trim(),
          studentName: studentName.trim() || undefined,
          courseInterest: course,
          preferredCallbackWindow: callbackWindow,
          message: message.trim() || undefined,
          consentGiven: consent,
          source: 'website',
          sourceUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
          website_hp: honeypot || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      setStatus('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'A network error occurred. Please call +91 94437 18847 directly.';
      setErrorMessage(msg);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="modal-content" ref={modalRef} style={{ maxWidth: '580px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-dark-muted)',
            padding: '4px',
            borderRadius: '4px',
          }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#ecfdf5',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2
              id="enquiry-modal-title"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--navy-primary)' }}
            >
              Enquiry Received Successfully
            </h2>
            <p style={{ color: 'var(--text-dark-muted)', margin: '12px 0 24px', lineHeight: '1.6' }}>
              Thank you, <strong>{parentName}</strong>. Your enquiry for <strong>{course}</strong> has been logged in our admission registry. Our senior counsellor will reach you at <strong>{phone}</strong> during your requested window.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={onClose} className="btn btn-primary">
                Done
              </button>
              <a href="tel:+919443718847" className="btn btn-secondary">
                <Phone size={16} /> Call Desk Now
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span className="section-eyebrow">Direct Admission Desk</span>
              <h2
                id="enquiry-modal-title"
                style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: 'var(--navy-primary)' }}
              >
                Enquire About Admissions
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>
                Fill in your details below. Our counselling desk will contact you with batch availability and curriculum guidance.
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '0.875rem',
                }}
                role="alert"
              >
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Anti-spam honeypot (hidden from humans) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="website_hp">Leave empty</label>
                <input
                  id="website_hp"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="parent_name">
                  Parent / Guardian Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="parent_name"
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. S. Ramanathan"
                  className="form-input"
                />
              </div>

              <div className="grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone_number">
                    Mobile Phone Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    id="phone_number"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => validatePhoneInput(e.target.value)}
                    placeholder="+91 94437 18847"
                    className="form-input"
                    aria-invalid={!!phoneError}
                    aria-describedby={phoneError ? 'phone-error' : 'phone-hint'}
                  />
                  {phoneError ? (
                    <p id="phone-error" className="form-error">
                      {phoneError}
                    </p>
                  ) : (
                    <p id="phone-hint" className="form-hint">
                      10-digit Indian mobile number
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="student_name">
                    Student Name (Optional)
                  </label>
                  <input
                    id="student_name"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. R. Karthik"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="programme_select">
                    Programme of Interest <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    id="programme_select"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="form-select"
                  >
                    <option value="Sainik School (AISSEE) Class VI">Sainik School (AISSEE) Class VI</option>
                    <option value="Sainik School (AISSEE) Class IX">Sainik School (AISSEE) Class IX</option>
                    <option value="Rashtriya Indian Military College (RIMC)">RIMC Dehradun Entrance</option>
                    <option value="Rashtriya Military Schools (RMS CET)">Rashtriya Military Schools (RMS)</option>
                    <option value="General Counselling / Unsure">General Defence School Counselling</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="callback_window">
                    Preferred Callback Window
                  </label>
                  <select
                    id="callback_window"
                    value={callbackWindow}
                    onChange={(e) => setCallbackWindow(e.target.value)}
                    className="form-select"
                  >
                    <option value="Morning (09:00 AM – 12:00 PM)">Morning (09:00 AM – 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM – 03:00 PM)">Afternoon (12:00 PM – 03:00 PM)</option>
                    <option value="Evening (03:00 PM – 06:30 PM)">Evening (03:00 PM – 06:30 PM)</option>
                    <option value="Anytime during office hours">Anytime during office hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="enquiry_message">
                  Message or Specific Question (Optional)
                </label>
                <textarea
                  id="enquiry_message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention student's current class, date of birth, or boarding requirement..."
                  className="form-textarea"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  id="consent_checkbox"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="consent_checkbox" style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)' }}>
                  I consent to allow Kalaivani Sainik RIMC Coaching Centre to contact me via telephone/WhatsApp regarding admissions and course information.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-gold btn-lg"
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Admission Enquiry</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  style={{ padding: '12px 20px' }}
                >
                  Cancel
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '16px',
                  fontSize: '0.78rem',
                  color: 'var(--text-dark-muted)',
                }}
              >
                <Lock size={12} />
                <span>Your contact details are strictly confidential and never shared with third parties.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
