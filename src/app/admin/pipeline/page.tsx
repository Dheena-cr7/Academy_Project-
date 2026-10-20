'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, User, Phone, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import QuickCallModal from '@/components/admin/QuickCallModal';

export default function AdminPipelinePage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [callModalContact, setCallModalContact] = useState<any | null>(null);

  const stages = [
    { key: 'new', label: 'New Lead', color: '#0284c7' },
    { key: 'contact_attempted', label: 'Attempted', color: '#eab308' },
    { key: 'connected', label: 'Connected', color: '#10b981' },
    { key: 'interested', label: 'Interested', color: '#8b5cf6' },
    { key: 'follow_up_scheduled', label: 'Follow-up Set', color: '#f59e0b' },
    { key: 'visit_planned', label: 'Visit Planned', color: '#f97316' },
    { key: 'admission_confirmed', label: 'Enrolled / Confirmed', color: '#059669' },
  ];

  const fetchPipeline = () => {
    setLoading(true);
    fetch('/api/admin/contacts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContacts(data.contacts);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const moveStatus = async (contactId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchPipeline();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Admissions Pipeline Stages
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Visual pipeline tracking cadet progression from initial web/phone enquiry to final admission confirmation.
          </p>
        </div>
      </div>

      {/* Pipeline Board */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '24px',
          minHeight: '650px',
        }}
      >
        {stages.map((stage, idx) => {
          const stageContacts = contacts.filter((c) => c.status === stage.key);
          return (
            <div
              key={stage.key}
              style={{
                width: '280px',
                minWidth: '280px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--ivory-muted)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Stage Header */}
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--ivory-muted)',
                  borderTop: `4px solid ${stage.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                  {stage.label}
                </div>
                <span className="badge" style={{ backgroundColor: 'rgba(10,25,47,0.08)', color: 'var(--navy-primary)', fontSize: '0.72rem' }}>
                  {stageContacts.length}
                </span>
              </div>

              {/* Stage Cards */}
              <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                {stageContacts.length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-dark-muted)', fontSize: '0.8rem' }}>
                    No leads in this stage
                  </div>
                ) : (
                  stageContacts.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--ivory-muted)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-primary)' }}>
                        {c.parent_name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
                        {c.primary_phone}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gold-dark)', fontWeight: 600, marginTop: '2px' }}>
                        {c.course_interest}
                      </div>

                      {/* Card Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <button
                          onClick={() =>
                            setCallModalContact({
                              id: c.id,
                              phone: c.primary_phone,
                              parentName: c.parent_name,
                            })
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--navy-primary)',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600,
                          }}
                        >
                          <Phone size={12} /> Call
                        </button>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          {idx > 0 && (
                            <button
                              onClick={() => moveStatus(c.id, stages[idx - 1].key)}
                              style={{ padding: '2px 6px', fontSize: '0.7rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              title={`Move back to ${stages[idx - 1].label}`}
                            >
                              ←
                            </button>
                          )}
                          {idx < stages.length - 1 && (
                            <button
                              onClick={() => moveStatus(c.id, stages[idx + 1].key)}
                              style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'var(--navy-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              title={`Advance to ${stages[idx + 1].label}`}
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {callModalContact && (
        <QuickCallModal
          isOpen={!!callModalContact}
          onClose={() => setCallModalContact(null)}
          defaultContactId={callModalContact.id}
          defaultPhone={callModalContact.phone}
          defaultParentName={callModalContact.parentName}
          onCallLogged={fetchPipeline}
        />
      )}
    </div>
  );
}
