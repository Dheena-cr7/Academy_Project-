'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Phone,
  Zap,
  GitMerge,
  Archive,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { formatToKolkata } from '@/lib/utils';
import QuickCallModal from '@/components/admin/QuickCallModal';
import QuickEnquiryModal from '@/components/QuickEnquiryModal';
import MergeContactsModal from '@/components/admin/MergeContactsModal';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  // Modals state
  const [callModalContact, setCallModalContact] = useState<any | null>(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [mergePrimary, setMergePrimary] = useState<any | null>(null);
  const [mergeSecondary, setMergeSecondary] = useState<any | null>(null);

  const fetchContacts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/contacts?${params.toString()}`)
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
    fetchContacts();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts();
  };

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive contact for ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchContacts();
    } catch (err) {
      alert('Failed to archive contact');
    }
  };

  const handleInitiateMerge = (contact: any) => {
    // Find matching duplicates
    const matched = contacts.find((c) => c.normalized_phone === contact.normalized_phone && c.id !== contact.id);
    if (matched) {
      setMergePrimary(contact);
      setMergeSecondary(matched);
    } else {
      alert('No other loaded contact matches this phone number directly. Try clearing search filters.');
    }
  };

  return (
    <div>
      {/* Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Contacts & Enquiry Registry
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Search by parent name, normalized 10-digit mobile number, or enquiry ID.
          </p>
        </div>

        <button onClick={() => setIsNewLeadOpen(true)} className="btn btn-gold btn-sm">
          <Plus size={16} /> Add New Contact
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search parent name, phone (+91 94437...), student, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '42px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dark-muted)' }} />
          </div>

          <div style={{ width: '200px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ height: '42px' }}
            >
              <option value="">All Statuses</option>
              <option value="new">New Lead</option>
              <option value="contact_attempted">Contact Attempted</option>
              <option value="connected">Connected</option>
              <option value="interested">Interested</option>
              <option value="follow_up_scheduled">Follow-up Scheduled</option>
              <option value="visit_planned">Campus Visit Planned</option>
              <option value="admission_confirmed">Admission Confirmed</option>
              <option value="not_interested">Not Interested</option>
              <option value="duplicate">Duplicate</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" style={{ height: '42px', padding: '0 20px' }}>
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setTimeout(fetchContacts, 50);
              }}
              className="btn btn-secondary btn-sm"
              style={{ height: '42px' }}
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Contacts Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Parent / Contact</th>
              <th>Target Programme</th>
              <th>Status</th>
              <th>Calls</th>
              <th>Assigned Staff</th>
              <th>Created (IST)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dark-muted)' }}>
                  Loading contacts directory...
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-dark-muted)' }}>
                  No contacts found matching criteria.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                      {c.parent_name}
                      {c.duplicate_count > 0 && (
                        <span
                          className="badge"
                          style={{
                            marginLeft: '8px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleInitiateMerge(c)}
                          title={`${c.duplicate_count} other record(s) share this phone. Click to review merge.`}
                        >
                          <AlertTriangle size={10} /> Duplicate Phone ({c.duplicate_count})
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
                      {c.primary_phone} {c.student_name ? `• Student: ${c.student_name}` : ''}
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{c.course_interest}</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', textTransform: 'uppercase' }}>
                      Src: {c.source}
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {c.total_calls} logged
                    </div>
                    {c.pending_follow_ups > 0 && (
                      <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
                        ● {c.pending_follow_ups} follow-up due
                      </span>
                    )}
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{c.assigned_staff_name || 'Unassigned'}</span>
                  </td>

                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
                    {formatToKolkata(c.created_at)}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() =>
                          setCallModalContact({
                            id: c.id,
                            phone: c.primary_phone,
                            parentName: c.parent_name,
                          })
                        }
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="Quick Log Call"
                      >
                        <Zap size={14} style={{ color: 'var(--gold-dark)' }} />
                      </button>

                      {c.duplicate_count > 0 && (
                        <button
                          onClick={() => handleInitiateMerge(c)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px', color: '#1e40af' }}
                          title="Review & Merge Duplicates"
                        >
                          <GitMerge size={14} />
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedContact(c)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px' }}
                        title="View Full Dossier & Interaction History"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => handleArchive(c.id, c.parent_name)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px', color: '#dc2626' }}
                        title="Archive (Soft Delete)"
                      >
                        <Archive size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Call Modal */}
      {callModalContact && (
        <QuickCallModal
          isOpen={!!callModalContact}
          onClose={() => setCallModalContact(null)}
          defaultContactId={callModalContact.id}
          defaultPhone={callModalContact.phone}
          defaultParentName={callModalContact.parentName}
          onCallLogged={fetchContacts}
        />
      )}

      {/* New Lead Modal */}
      <QuickEnquiryModal
        isOpen={isNewLeadOpen}
        onClose={() => {
          setIsNewLeadOpen(false);
          fetchContacts();
        }}
      />

      {/* Merge Modal */}
      {mergePrimary && mergeSecondary && (
        <MergeContactsModal
          isOpen={!!mergePrimary && !!mergeSecondary}
          onClose={() => {
            setMergePrimary(null);
            setMergeSecondary(null);
          }}
          primaryContact={mergePrimary}
          secondaryContact={mergeSecondary}
          onMerged={fetchContacts}
        />
      )}

      {/* Contact Dossier / Detail Modal */}
      {selectedContact && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedContact(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '6px' }}>{selectedContact.status}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                  {selectedContact.parent_name}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
                  Enquiry ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{selectedContact.id}</code>
                </div>
              </div>
              <button onClick={() => setSelectedContact(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--ivory-light)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><strong>Primary Phone: </strong>{selectedContact.primary_phone}</div>
                <div><strong>Normalized: </strong>{selectedContact.normalized_phone}</div>
                <div><strong>Student Name: </strong>{selectedContact.student_name || 'N/A'}</div>
                <div><strong>Course Interest: </strong>{selectedContact.course_interest}</div>
                <div><strong>Source: </strong>{selectedContact.source}</div>
                <div><strong>Assigned To: </strong>{selectedContact.assigned_staff_name || 'Unassigned'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '6px' }}>
                Notes & Context
              </h4>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--ivory-muted)', padding: '12px', borderRadius: '4px', fontSize: '0.85rem', whiteSpace: 'pre-line', color: 'var(--text-dark)' }}>
                {selectedContact.notes || 'No notes recorded.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setCallModalContact({
                    id: selectedContact.id,
                    phone: selectedContact.primary_phone,
                    parentName: selectedContact.parent_name,
                  });
                  setSelectedContact(null);
                }}
                className="btn btn-gold"
                style={{ flex: 1 }}
              >
                <Zap size={16} /> Log Call for this Contact
              </button>
              <button onClick={() => setSelectedContact(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
