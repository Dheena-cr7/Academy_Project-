'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  Calendar,
  User,
  X,
} from 'lucide-react';
import { formatToKolkata } from '@/lib/utils';

export default function AdminFollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed' | 'all'>('today');

  // Modal actions
  const [rescheduleItem, setRescheduleItem] = useState<any | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  const fetchFollowUps = (tab = activeTab) => {
    setLoading(true);
    fetch(`/api/admin/follow-ups?filter=${tab}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFollowUps(data.followUps);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFollowUps(activeTab);
  }, [activeTab]);

  const handleComplete = async (id: string) => {
    const notes = prompt('Enter resolution notes for this callback (optional):');
    try {
      const res = await fetch('/api/admin/follow-ups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'complete', notes }),
      });
      if (res.ok) fetchFollowUps();
    } catch {
      alert('Failed to complete follow-up');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleItem || !newDueDate) return;

    try {
      const res = await fetch('/api/admin/follow-ups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rescheduleItem.id,
          action: 'reschedule',
          dueAt: newDueDate,
          notes: actionNotes,
        }),
      });

      if (res.ok) {
        setRescheduleItem(null);
        setNewDueDate('');
        setActionNotes('');
        fetchFollowUps();
      }
    } catch {
      alert('Failed to reschedule');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Follow-Up & Callback Tasks
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Timely parent callbacks ensure no prospective cadet is missed. Configured for Asia/Kolkata timezone.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('today')}
            className={`btn btn-sm ${activeTab === 'today' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Due Today
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`btn btn-sm ${activeTab === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ color: activeTab === 'overdue' ? '#fff' : '#ef4444' }}
          >
            Overdue Callbacks
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Tasks
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Contact Details</th>
              <th>Due Date & Time (IST)</th>
              <th>Priority</th>
              <th>Assigned Staff</th>
              <th>Last Call Outcome</th>
              <th>Follow-up Instructions</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dark-muted)' }}>
                  Loading follow-up tasks...
                </td>
              </tr>
            ) : followUps.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-dark-muted)' }}>
                  No follow-up tasks found in this view.
                </td>
              </tr>
            ) : (
              followUps.map((fu) => (
                <tr key={fu.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                      {fu.parent_name || 'Enquiry'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
                      {fu.primary_phone} • {fu.course_interest}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: fu.status === 'pending' && new Date(fu.due_at) < new Date() ? '#ef4444' : 'var(--navy-primary)' }}>
                      {formatToKolkata(fu.due_at)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)' }}>
                      Timezone: {fu.timezone}
                    </div>
                  </td>

                  <td>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor:
                          fu.priority === 'urgent'
                            ? '#fee2e2'
                            : fu.priority === 'high'
                            ? '#fef3c7'
                            : '#f1f5f9',
                        color:
                          fu.priority === 'urgent'
                            ? '#991b1b'
                            : fu.priority === 'high'
                            ? '#92400e'
                            : '#475569',
                      }}
                    >
                      {fu.priority}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{fu.assigned_staff_name || 'Unassigned'}</span>
                  </td>

                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {fu.last_call_outcome || 'No prior calls'}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-dark)', maxWidth: '260px' }}>
                      {fu.notes || 'Routine follow-up'}
                    </div>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {fu.status === 'pending' ? (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleComplete(fu.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px', color: '#059669' }}
                          title="Mark Complete"
                        >
                          <Check size={14} /> Done
                        </button>
                        <button
                          onClick={() => {
                            setRescheduleItem(fu);
                            setNewDueDate(fu.due_at ? fu.due_at.slice(0, 16) : '');
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px', color: '#1e40af' }}
                          title="Reschedule Time"
                        >
                          <RotateCcw size={14} /> Reschedule
                        </button>
                      </div>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {rescheduleItem && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setRescheduleItem(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                Reschedule Callback
              </h3>
              <button onClick={() => setRescheduleItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="rs_due">New Callback Date & Time (IST)</label>
                <input
                  id="rs_due"
                  type="datetime-local"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rs_notes">Reason / Notes for Rescheduling</label>
                <textarea
                  id="rs_notes"
                  rows={2}
                  placeholder="e.g. Parent requested callback after 5 PM..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm Reschedule
                </button>
                <button type="button" onClick={() => setRescheduleItem(null)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
