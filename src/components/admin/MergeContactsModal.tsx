'use client';

import React, { useState } from 'react';
import { X, GitMerge, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatToKolkata } from '@/lib/utils';

interface MergeContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryContact: any;
  secondaryContact: any;
  onMerged?: () => void;
}

export default function MergeContactsModal({
  isOpen,
  onClose,
  primaryContact,
  secondaryContact,
  onMerged,
}: MergeContactsModalProps) {
  const [mergeNotes, setMergeNotes] = useState('Consolidating duplicate parent phone records');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen || !primaryContact || !secondaryContact) return null;

  const handleMerge = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/admin/contacts/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryContactId: primaryContact.id,
          secondaryContactId: secondaryContact.id,
          mergeNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to merge contacts');
      }

      setSuccessMessage('Contacts merged successfully with reversible audit record.');
      setTimeout(() => {
        onClose();
        onMerged?.();
      }, 1200);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error executing merge');
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
      aria-labelledby="merge-modal-title"
    >
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark-muted)' }}
          aria-label="Close merge dialog"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitMerge size={20} />
          </div>
          <div>
            <h2 id="merge-modal-title" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Review Duplicate Contact Merge
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)' }}>
              Side-by-side review before merging. All calls, follow-ups, and notes will be transferred to Primary.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Side-by-Side Comparison */}
        <div className="grid-2" style={{ gap: '16px', marginBottom: '20px' }}>
          {/* Primary Record (Surviving) */}
          <div style={{ border: '2px solid #059669', borderRadius: 'var(--radius-sm)', padding: '16px', backgroundColor: '#f0fdf4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-success">Surviving Primary Record</span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{primaryContact.id}</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              {primaryContact.parent_name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '4px' }}>
              <strong>Phone: </strong>{primaryContact.primary_phone}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '2px' }}>
              <strong>Student: </strong>{primaryContact.student_name || 'N/A'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '2px' }}>
              <strong>Course: </strong>{primaryContact.course_interest}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '2px' }}>
              <strong>Status: </strong>{primaryContact.status}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)', marginTop: '8px' }}>
              Created: {formatToKolkata(primaryContact.created_at)}
            </div>
          </div>

          {/* Secondary Record (Archived Duplicate) */}
          <div style={{ border: '1px solid var(--ivory-muted)', borderRadius: 'var(--radius-sm)', padding: '16px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>Duplicate (To Be Archived)</span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{secondaryContact.id}</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              {secondaryContact.parent_name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '4px' }}>
              <strong>Phone: </strong>{secondaryContact.primary_phone}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '2px' }}>
              <strong>Student: </strong>{secondaryContact.student_name || 'N/A'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '2px' }}>
              <strong>Course: </strong>{secondaryContact.course_interest}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '2px' }}>
              <strong>Status: </strong>{secondaryContact.status}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)', marginTop: '8px' }}>
              Created: {formatToKolkata(secondaryContact.created_at)}
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" htmlFor="merge_notes">
            Merge Reason / Justification Note
          </label>
          <input
            id="merge_notes"
            type="text"
            value={mergeNotes}
            onChange={(e) => setMergeNotes(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleMerge}
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ flex: 1, backgroundColor: '#059669', borderColor: '#059669' }}
          >
            {isSubmitting ? 'Merging Records...' : 'Confirm & Merge Contacts'}
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
