'use client';

import React, { useState } from 'react';
import { X, Phone, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { normalizeIndianPhoneNumber } from '@/lib/utils';

interface QuickCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallLogged?: () => void;
  defaultContactId?: string;
  defaultPhone?: string;
  defaultParentName?: string;
}

export default function QuickCallModal({
  isOpen,
  onClose,
  onCallLogged,
  defaultContactId,
  defaultPhone = '',
  defaultParentName = '',
}: QuickCallModalProps) {
  const [contactId, setContactId] = useState(defaultContactId || '');
  const [callerPhone, setCallerPhone] = useState(defaultPhone);
  const [parentName, setParentName] = useState(defaultParentName);
  const [direction, setDirection] = useState<'outgoing' | 'incoming'>('outgoing');
  const [outcome, setOutcome] = useState('connected');
  const [durationSeconds, setDurationSeconds] = useState('120');
  const [notes, setNotes] = useState('');
  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpPriority, setFollowUpPriority] = useState('normal');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/admin/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: contactId || undefined,
          newContactPhone: !contactId ? callerPhone : undefined,
          newContactParentName: !contactId ? parentName : undefined,
          direction,
          outcome,
          durationSeconds: parseInt(durationSeconds, 10) || 0,
          notes: notes.trim(),
          scheduleFollowUp,
          followUpDate: scheduleFollowUp ? followUpDate : undefined,
          followUpPriority,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to log call');
      }

      setSuccessMessage('Call logged successfully (marked as staff-reported).');
      setTimeout(() => {
        onClose();
        onCallLogged?.();
      }, 1000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error logging call');
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
      aria-labelledby="quick-call-title"
    >
      <div className="modal-content" style={{ maxWidth: '540px' }}>
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
          }}
          aria-label="Close call modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--navy-primary)',
              color: 'var(--gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Phone size={18} />
          </div>
          <div>
            <h2 id="quick-call-title" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Quick Call Logging
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
              Record call details in a few seconds (marked as Staff-Reported)
            </p>
          </div>
        </div>

        {errorMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!contactId && (
            <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="form-label" htmlFor="qc_phone">Caller Phone</label>
                <input
                  id="qc_phone"
                  type="tel"
                  required
                  placeholder="+91 94437 18847"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="qc_name">Parent Name</label>
                <input
                  id="qc_name"
                  type="text"
                  placeholder="e.g. S. Ramanathan"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
            <div>
              <label className="form-label" htmlFor="qc_dir">Call Direction</label>
              <select
                id="qc_dir"
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'outgoing' | 'incoming')}
                className="form-select"
              >
                <option value="outgoing">Outgoing (We called parent)</option>
                <option value="incoming">Incoming (Parent called us)</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="qc_outcome">Call Outcome</label>
              <select
                id="qc_outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="form-select"
                required
              >
                <option value="connected">Connected / Spoke with Parent</option>
                <option value="info_provided">Information & Syllabus Provided</option>
                <option value="callback_required">Callback Required / Parent Busy</option>
                <option value="no_answer">No Answer / Ringing</option>
                <option value="busy">Line Busy</option>
                <option value="switched_off">Phone Switched Off / Out of Reach</option>
                <option value="wrong_number">Wrong Number / Invalid</option>
                <option value="not_interested">Not Interested / Cancelled</option>
                <option value="other">Other Outcome</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" htmlFor="qc_dur">Duration (Seconds)</label>
            <input
              id="qc_dur"
              type="number"
              min="0"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" htmlFor="qc_notes">Call Notes</label>
            <textarea
              id="qc_notes"
              rows={2}
              placeholder="What was discussed? (e.g. Inquired about Class 6 boarding fee, scheduled campus visit for Saturday)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ backgroundColor: 'var(--ivory-light)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: scheduleFollowUp ? '12px' : 0 }}>
              <input
                id="qc_sched"
                type="checkbox"
                checked={scheduleFollowUp}
                onChange={(e) => setScheduleFollowUp(e.target.checked)}
              />
              <label htmlFor="qc_sched" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy-primary)', cursor: 'pointer' }}>
                Schedule Follow-up / Callback
              </label>
            </div>

            {scheduleFollowUp && (
              <div className="grid-2" style={{ gap: '10px' }}>
                <div>
                  <label className="form-label" htmlFor="qc_fdate" style={{ fontSize: '0.8rem' }}>Due Date & Time (IST)</label>
                  <input
                    id="qc_fdate"
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="form-input"
                    required={scheduleFollowUp}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="qc_fprio" style={{ fontSize: '0.8rem' }}>Priority</label>
                  <select
                    id="qc_fprio"
                    value={followUpPriority}
                    onChange={(e) => setFollowUpPriority(e.target.value)}
                    className="form-select"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-gold"
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Saving Call Record...' : 'Save Call Log'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
