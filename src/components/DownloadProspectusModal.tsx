'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  CheckCircle,
  Phone,
  Shield,
  BookOpen,
  Award,
} from 'lucide-react';
import { trackEvent, getStoredUtmParameters } from '@/lib/analytics';

interface DownloadProspectusModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone?: string;
}

export default function DownloadProspectusModal({
  isOpen,
  onClose,
  phone = '+91 94437 18847',
}: DownloadProspectusModalProps) {
  const [parentName, setParentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [courseInterest, setCourseInterest] = useState('Sainik School (AISSEE)');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = mobileNumber.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanInput)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);

    try {
      const utm = getStoredUtmParameters();
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName.trim(),
          phone: mobileNumber.trim(),
          courseInterest,
          message: 'Requested 2026-2027 Official Prospectus & Syllabus PDF',
          consentGiven: true,
          ...utm,
        }),
      });

      trackEvent('prospectus_request', {
        courseInterest,
        parentName: parentName.trim(),
      });

      setSubmitted(true);
    } catch {
      setError('Connection error. Please call our admissions desk directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 14, 27, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
        }}
      >
        {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(197, 160, 89, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-light)',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Official Academy Document
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                Download 2026–27 Prospectus
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
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

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                Prospectus Ready for Download!
              </h4>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
                Thank you, <strong>{parentName}</strong>. You can now download the complete 32-page institutional prospectus, fee schedule, and NTA AISSEE syllabus breakdown below.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="/docs/Kalaivani_Sainik_Prospectus_2026_2027.pdf"
                  download="Kalaivani_Sainik_Prospectus_2026_2027.pdf"
                  className="btn btn-gold-foil"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                  onClick={() => {
                    trackEvent('prospectus_download_complete', {
                      courseInterest,
                    });
                  }}
                >
                  <Download size={18} />
                  <span>Download Complete Prospectus (PDF)</span>
                </a>

                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                >
                  <Phone size={14} />
                  <span>Speak with Admissions Desk: {phone}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDownload}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '0.825rem', color: 'var(--navy-primary)' }}>
                <strong>Prospectus Includes:</strong> Full NTA AISSEE Class VI & IX Syllabus • RIMC Exam Pattern • 24-Hour Cadet Timetable • Hostel & Food Guidelines • Fee Schedule & Admission Roadmap.
              </div>

              {error && (
                <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: '4px', fontSize: '0.825rem', marginBottom: '14px', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R. Venkatesan"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                  10-Digit Mobile Number (to send PDF link) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 94437 18847"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                  Programme of Interest
                </label>
                <select
                  value={courseInterest}
                  onChange={(e) => setCourseInterest(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                >
                  <option value="Sainik School (AISSEE)">AISSEE Sainik School (Class VI & IX)</option>
                  <option value="RIMC Dehradun">Rashtriya Indian Military College (RIMC)</option>
                  <option value="Rashtriya Military Schools (RMS)">Rashtriya Military Schools (RMS CET)</option>
                  <option value="General Foundation">Foundation & Summer Residential Batch</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? (
                  <span>Generating Access...</span>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Access Official Prospectus & Syllabus</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
